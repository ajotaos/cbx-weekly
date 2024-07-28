import {
	publisherTableItemGsi2PaginationCursorSchema,
	publisherTableItemGsi2PaginationKeySchema,
	publisherTableItemSchema,
} from '../types';

import {
	encodePublisherTableItemGsi2PaginationCursor,
	encodePublisherTableItemGsi2PaginationKeys,
	encodePublisherTableItemGsi2PartitionKey,
	encodePublisherTableItemGsi2SortKey,
} from '../keys';

import { QueryCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

import * as v from 'valibot';

import type { DynamoDBClient } from '@aws-sdk/client-dynamodb';

export async function queryPublisherItemsFromTable(
	props: QueryPublisherItemsFromTable.Props,
	tableName: string,
	client: DynamoDBClient,
) {
	const { key, order, limit, consistentRead } = parseProps(props);

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
					':gsi2pk': encodePublisherTableItemGsi2PartitionKey(),
					':gsi2skPrefix': encodePublisherTableItemGsi2SortKey({ slug: '' }),
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
			cursor: v.optional(
				v.pipe(
					publisherTableItemGsi2PaginationCursorSchema,
					v.transform(encodePublisherTableItemGsi2PaginationKeys),
					v.transform((value) => marshall(value)),
				),
			),
			order: v.optional(v.picklist(['asc', 'desc'])),
			limit: v.optional(v.pipe(v.number(), v.integer(), v.minValue(1))),
			consistentRead: v.optional(v.boolean()),
		}),
		v.transform((value) => ({
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
					v.pipe(v.any(), v.transform(unmarshall), publisherTableItemSchema),
				),
				[],
			),
			LastEvaluatedKey: v.optional(
				v.pipe(
					v.any(),
					v.transform(unmarshall),
					publisherTableItemGsi2PaginationKeySchema,
					v.transform(encodePublisherTableItemGsi2PaginationCursor),
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

export declare namespace QueryPublisherItemsFromTable {
	type Props = Partial<{
		cursor: string;
		order: 'asc' | 'desc';
		limit: number;
		consistentRead: boolean;
	}>;
}
