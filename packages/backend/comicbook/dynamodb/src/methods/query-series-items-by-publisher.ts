import {
	seriesTableItemGsi2PaginationCursorSchema,
	seriesTableItemGsi2PaginationKeySchema,
	seriesTableItemSchema,
	// tableItemGsi2PaginationCursorSchema,
} from '../types';

import {
	encodeIssueTableItemGsi2PaginationKeys,
	encodeSeriesTableItemGsi2PaginationCursor,
	encodeSeriesTableItemGsi2PaginationKeys,
	encodeSeriesTableItemGsi2PartitionKey,
	encodeSeriesTableItemGsi2SortKey,
} from '../keys';

import { QueryCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

import * as vx from '@cbx-weekly/shared-valibot'
import * as v from 'valibot';

import type { DynamoDBClient } from '@aws-sdk/client-dynamodb';

export async function querySeriesItemsByPublisherFromTable(
	props: QuerySeriesItemsByPublisherFromTable.Props,
	tableName: string,
	client: DynamoDBClient,
) {
	const { publisherId, key, order, limit, consistentRead } = parseProps(props);

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
					':gsi2pk': encodeSeriesTableItemGsi2PartitionKey({
						publisherId: publisherId,
					}),
					':gsi2skPrefix': encodeSeriesTableItemGsi2SortKey({ slug: '' }),
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
			publisherId: v.pipe(v.string(), vx.ulid()),
			cursor: v.optional(
				v.pipe(
					seriesTableItemGsi2PaginationCursorSchema,
					v.transform(encodeSeriesTableItemGsi2PaginationKeys),
					v.transform((value) => marshall(value)),
				),
			),
			order: v.optional(v.picklist(['asc', 'desc'])),
			limit: v.optional(v.pipe(v.number(), v.integer(), v.minValue(1))),
			consistentRead: v.optional(v.boolean()),
		}),
		v.transform((value) => ({
			publisherId: value.publisherId,
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
				v.array(
					v.pipe(v.any(), v.transform(unmarshall), seriesTableItemSchema),
				),
				[],
			),
			LastEvaluatedKey: v.optional(
				v.pipe(
					v.any(),
					v.transform(unmarshall),
					seriesTableItemGsi2PaginationKeySchema,
					v.transform(encodeSeriesTableItemGsi2PaginationCursor),
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

export declare namespace QuerySeriesItemsByPublisherFromTable {
	type Props = {
		publisherId: string;
	} & Partial<{
		cursor: string;
		order: 'asc' | 'desc';
		limit: number;
		consistentRead: boolean;
	}>;
}
