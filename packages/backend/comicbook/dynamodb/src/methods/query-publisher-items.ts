import {
	publisherTableItemGsi2PaginationCursorSchema,
	publisherTableItemGsi2PaginationKeysSchema,
	publisherTableItemSchema,
} from '../types';

import {
	encodePublisherTableItemGsi2PaginationCursor,
	encodePublisherTableItemGsi2PartitionKey,
	encodePublisherTableItemGsi2SortKey,
	encodePublisherTableItemPartitionKey,
	encodePublisherTableItemSortKey,
} from '../keys';

import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';

import * as v from '@cbx-weekly/backend-core-valibot';

import type { Publisher } from '../types';

import type { DynamoDBClient } from '@aws-sdk/client-dynamodb';

export async function queryPublisherItemsFromTable(
	props: QueryPublisherItemsFromTable.Props,
	tableName: string,
	client: DynamoDBClient,
) {
	const documentClient = DynamoDBDocumentClient.from(client);

	const {
		cursor: pagination,
		order,
		limit,
		consistentRead,
	} = parseProps(props);

	return documentClient
		.send(
			new QueryCommand({
				TableName: tableName,
				IndexName: 'Gsi2',
				ExpressionAttributeNames: {
					'#gsi2pk': 'Gsi2Pk',
					'#gsi2sk': 'Gsi2Sk',
				},
				ExpressionAttributeValues: {
					':gsi2pk': encodePublisherTableItemGsi2PartitionKey(),
					':gsi2sk': encodePublisherTableItemGsi2SortKey({ slug: '' }),
				},
				KeyConditionExpression:
					'#gsi2pk = :gsi2pk AND begins_with(#gsi2sk, :gsi2sk)',
				ConsistentRead: consistentRead,
				ExclusiveStartKey: mapIfDefined(
					pagination,
					({ id, slug }) =>
						({
							Pk: encodePublisherTableItemPartitionKey({ id }),
							Sk: encodePublisherTableItemSortKey(),
							Gsi2Pk: encodePublisherTableItemGsi2PartitionKey(),
							Gsi2Sk: encodePublisherTableItemGsi2SortKey({ slug }),
						}) satisfies Pick<
							Publisher.TableItem.Raw,
							'Pk' | 'Sk' | 'Gsi2Pk' | 'Gsi2Sk'
						>,
				),
				ScanIndexForward: order !== 'desc',
				Limit: limit,
			}),
		)
		.then(({ Items, LastEvaluatedKey }) => {
			const items = parseItems(Items);

			const pagination = parsePaginationKeys(LastEvaluatedKey);

			return {
				items,
				cursor: mapIfDefined(
					pagination,
					encodePublisherTableItemGsi2PaginationCursor,
				),
			};
		});
}

const parseProps = v.parser(
	v.strictObject({
		cursor: v.optional(publisherTableItemGsi2PaginationCursorSchema),
		order: v.optional(v.picklist(['asc', 'desc'])),
		limit: v.optional(v.pipe(v.number(), v.integer(), v.minValue(1))),
		consistentRead: v.optional(v.boolean()),
	}),
);

const parseItems = v.parser(v.optional(v.array(publisherTableItemSchema), []));

const parsePaginationKeys = v.parser(
	v.optional(publisherTableItemGsi2PaginationKeysSchema),
);

function mapIfDefined<T, U>(
	value: T | undefined,
	fn: (value: T) => U,
): U | undefined {
	return value !== undefined ? fn(value) : undefined;
}

export declare namespace QueryPublisherItemsFromTable {
	type Props = Partial<{
		cursor: string;
		order: 'asc' | 'desc';
		limit: number;
		consistentRead: boolean;
	}>;
}
