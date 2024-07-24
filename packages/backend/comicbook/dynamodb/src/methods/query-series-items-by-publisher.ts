import {
	seriesTableItemGsi2PaginationCursorSchema,
	seriesTableItemGsi2PaginationKeysSchema,
	seriesTableItemSchema,
} from '../types';

import {
	encodeSeriesTableItemGsi2PaginationCursor,
	encodeSeriesTableItemGsi2PartitionKey,
	encodeSeriesTableItemGsi2SortKey,
	encodeSeriesTableItemPartitionKey,
	encodeSeriesTableItemSortKey,
} from '../keys';

import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';

import * as v from '@cbx-weekly/backend-core-valibot';

import type { Series } from '../types';

import type { DynamoDBClient } from '@aws-sdk/client-dynamodb';

import type { Simplify } from 'type-fest';

export async function querySeriesItemsByPublisherFromTable(
	props: QuerySeriesItemsByPublisherFromTable.Props,
	tableName: string,
	client: DynamoDBClient,
) {
	const documentClient = DynamoDBDocumentClient.from(client);

	const {
		publisherId,
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
					':gsi2pk': encodeSeriesTableItemGsi2PartitionKey({ publisherId }),
					':gsi2sk': encodeSeriesTableItemGsi2SortKey({ slug: '' }),
				},
				KeyConditionExpression:
					'#gsi2pk = :gsi2pk AND begins_with(#gsi2sk, :gsi2sk)',
				ConsistentRead: consistentRead,
				ExclusiveStartKey: mapIfDefined(
					pagination,
					({ id, slug, publisherId }) =>
						({
							Pk: encodeSeriesTableItemPartitionKey({ id }),
							Sk: encodeSeriesTableItemSortKey(),
							Gsi2Pk: encodeSeriesTableItemGsi2PartitionKey({ publisherId }),
							Gsi2Sk: encodeSeriesTableItemGsi2SortKey({ slug }),
						}) satisfies Pick<
							Series.TableItem.Raw,
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
					encodeSeriesTableItemGsi2PaginationCursor,
				),
			};
		});
}

const parseProps = v.parser(
	v.strictObject({
		publisherId: v.pipe(v.string(), v.id()),
		cursor: v.optional(seriesTableItemGsi2PaginationCursorSchema),
		order: v.optional(v.picklist(['asc', 'desc'])),
		limit: v.optional(v.pipe(v.number(), v.integer(), v.minValue(1))),
		consistentRead: v.optional(v.boolean()),
	}),
);

const parseItems = v.parser(v.optional(v.array(seriesTableItemSchema), []));

const parsePaginationKeys = v.parser(
	v.optional(seriesTableItemGsi2PaginationKeysSchema),
);

function mapIfDefined<T, U>(
	value: T | undefined,
	fn: (value: T) => U,
): U | undefined {
	return value !== undefined ? fn(value) : undefined;
}

export declare namespace QuerySeriesItemsByPublisherFromTable {
	type Props = Simplify<
		{ publisherId: string } & Partial<{
			cursor: string;
			order: 'asc' | 'desc';
			limit: number;
			consistentRead: boolean;
		}>
	>;
}
