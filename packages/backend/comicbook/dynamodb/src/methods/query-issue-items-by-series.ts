import {
	issueTableItemGsi2PaginationCursorSchema,
	issueTableItemGsi2PaginationKeysSchema,
	issueTableItemSchema,
} from '../types';

import {
	encodeIssueTableItemGsi2PaginationCursor,
	encodeIssueTableItemGsi2PartitionKey,
	encodeIssueTableItemGsi2SortKey,
	encodeIssueTableItemPartitionKey,
	encodeIssueTableItemSortKey,
} from '../keys';

import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';

import * as v from '@cbx-weekly/backend-core-valibot';

import type { Issue } from '../types';

import type { DynamoDBClient } from '@aws-sdk/client-dynamodb';

import type { Simplify } from 'type-fest';

export async function queryIssueItemsBySeriesFromTable(
	props: QueryIssueItemsBySeriesFromTable.Props,
	tableName: string,
	client: DynamoDBClient,
) {
	const documentClient = DynamoDBDocumentClient.from(client);

	const {
		seriesId,
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
					':gsi2pk': encodeIssueTableItemGsi2PartitionKey({ seriesId }),
					':gsi2sk': encodeIssueTableItemGsi2SortKey({ slug: '' }),
				},
				KeyConditionExpression:
					'#gsi2pk = :gsi2pk AND begins_with(#gsi2sk, :gsi2sk)',
				ConsistentRead: consistentRead,
				ExclusiveStartKey: mapIfDefined(
					pagination,
					({ id, slug, seriesId }) =>
						({
							Pk: encodeIssueTableItemPartitionKey({ id }),
							Sk: encodeIssueTableItemSortKey(),
							Gsi2Pk: encodeIssueTableItemGsi2PartitionKey({ seriesId }),
							Gsi2Sk: encodeIssueTableItemGsi2SortKey({ slug }),
						}) satisfies Pick<
							Issue.TableItem.Raw,
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
					encodeIssueTableItemGsi2PaginationCursor,
				),
			};
		});
}

const parseProps = v.parser(
	v.strictObject({
		seriesId: v.pipe(v.string(), v.id()),
		cursor: v.optional(issueTableItemGsi2PaginationCursorSchema),
		order: v.optional(v.picklist(['asc', 'desc'])),
		limit: v.optional(v.pipe(v.number(), v.integer(), v.minValue(1))),
		consistentRead: v.optional(v.boolean()),
	}),
);

const parseItems = v.parser(v.optional(v.array(issueTableItemSchema), []));

const parsePaginationKeys = v.parser(
	v.optional(issueTableItemGsi2PaginationKeysSchema),
);

function mapIfDefined<T, U>(
	value: T | undefined,
	fn: (value: T) => U,
): U | undefined {
	return value !== undefined ? fn(value) : undefined;
}

export declare namespace QueryIssueItemsBySeriesFromTable {
	type Props = Simplify<
		{ seriesId: string } & Partial<{
			cursor: string;
			order: 'asc' | 'desc';
			limit: number;
			consistentRead: boolean;
		}>
	>;
}
