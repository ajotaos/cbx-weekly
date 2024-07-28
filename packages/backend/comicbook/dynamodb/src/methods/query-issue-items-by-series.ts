import {
	issueTableItemGsi2PaginationCursorSchema,
	issueTableItemGsi2PaginationKeysSchema,
	issueTableItemSchema,
} from '../types';

import {
	encodeIssueTableItemGsi2PaginationCursor,
	encodeIssueTableItemGsi2PaginationKeys,
	encodeIssueTableItemGsi2PartitionKey,
	encodeIssueTableItemGsi2SortKey,
} from '../keys';

import { QueryCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

import * as vx from '@cbx-weekly/shared-valibot'
import * as v from 'valibot';

import type { DynamoDBClient } from '@aws-sdk/client-dynamodb';

export async function queryIssueItemsBySeriesFromTable(
	props: QueryIssueItemsBySeriesFromTable.Props,
	tableName: string,
	client: DynamoDBClient,
) {
	const { seriesId, key, order, limit, consistentRead } = parseProps(props);

	return client
		.send(
			new QueryCommand({
				TableName: tableName,
				IndexName: 'Gsi2',
				ExpressionAttributeNames: {
					'#Gsi2Pk': 'Gsi2Pk',
					'#Gsi2Sk': 'Gsi2Sk',
				},
				ExpressionAttributeValues: marshall({
					':gsi2pk': encodeIssueTableItemGsi2PartitionKey({
						seriesId,
					}),
					':gsi2skPrefix': encodeIssueTableItemGsi2SortKey({ slug: '' }),
				}),
				KeyConditionExpression:
					'#Gsi2Pk = :gsi2pk AND begins_with(#Gsi2Sk, :gsi2skPrefix)',
				ConsistentRead: consistentRead,
				ExclusiveStartKey: key,
				ScanIndexForward: order !== 'desc',
				Limit: limit,
			}),
		)
		.then(parseOutput);
}

const parseProps = v.parser(
	v.pipe(
		v.strictObject({
			seriesId: v.pipe(v.string(), vx.ulid()),
			cursor: v.optional(
				v.pipe(
					issueTableItemGsi2PaginationCursorSchema,
					v.transform(encodeIssueTableItemGsi2PaginationKeys),
					v.transform((value) => marshall(value)),
				),
			),
			order: v.optional(v.picklist(['asc', 'desc'])),
			limit: v.optional(v.pipe(v.number(), v.integer(), v.minValue(1))),
			consistentRead: v.optional(v.boolean()),
		}),
		v.transform((value) => ({
			seriesId: value.seriesId,
			key: value.cursor,
			order: value.order,
			limit: value.limit,
			consistentRead: value.consistentRead,
		})),
	),
	{
		abortEarly: true,
		abortPipeEarly: true,
	},
);

const parseOutput = v.parser(
	v.pipe(
		v.object({
			Items: v.optional(
				v.array(v.pipe(v.any(), v.transform(unmarshall), issueTableItemSchema)),
				[],
			),
			LastEvaluatedKey: v.optional(
				v.pipe(
					v.any(),
					v.transform(unmarshall),
					issueTableItemGsi2PaginationKeysSchema,
					v.transform(encodeIssueTableItemGsi2PaginationCursor),
				),
			),
		}),
		v.transform((value) => ({
			items: value.Items,
			cursor: value.LastEvaluatedKey,
		})),
	),
	{
		abortEarly: true,
		abortPipeEarly: true,
	},
);

export declare namespace QueryIssueItemsBySeriesFromTable {
	type Props = {
		seriesId: string;
	} & Partial<{
		cursor: string;
		order: 'asc' | 'desc';
		limit: number;
		consistentRead: boolean;
	}>;
}
