import { publisherTableItemSchema } from '../types';

import {
	encodePublisherTableItemGsi1PartitionKey,
	encodePublisherTableItemGsi1SortKey,
} from '../keys';

import { throwItemNotFoundError } from '@cbx-weekly/backend-core-dynamodb';

import { QueryCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

import * as vx from '@cbx-weekly/shared-valibot';
import * as v from 'valibot';

import type { DynamoDBClient } from '@aws-sdk/client-dynamodb';

export async function getPublisherItemBySlugFromTable(
	props: GetPublisherItemBySlugFromTable.Props,
	tableName: string,
	client: DynamoDBClient,
) {
	const { slug, consistentRead } = parseProps(props);

	const { item } = await client
		.send(
			new QueryCommand({
				TableName: tableName,
				IndexName: 'Gsi1',
				ExpressionAttributeNames: {
					'#Gsi1Pk': 'Gsi1Pk',
					'#Gsi1Sk': 'Gsi1Sk',
				},
				ExpressionAttributeValues: marshall({
					':gsi1pk': encodePublisherTableItemGsi1PartitionKey({ slug }),
					':gsi1sk': encodePublisherTableItemGsi1SortKey(),
				}),
				KeyConditionExpression: '#Gsi1Pk = :gsi1pk AND #Gsi1Sk = :gsi1sk',
				ConsistentRead: consistentRead,
				Limit: 1,
			}),
		)
		.then(parseOutput);

	if (item === undefined) {
		throwItemNotFoundError('publisher', { slug });
	}

	return { item };
}

const parseProps = v.parser(
	v.strictObject({
		slug: v.pipe(v.string(), vx.slug()),
		consistentRead: v.optional(v.boolean()),
	}),
	{
		abortEarly: true,
		abortPipeEarly: true,
	},
);

const parseOutput = v.parser(
	v.pipe(
		v.object({
			Items: v.pipe(
				v.array(v.any()),
				v.maxLength(1),
				v.transform((value) => value.at(0)),
				v.optional(
					v.pipe(v.any(), v.transform(unmarshall), publisherTableItemSchema),
				),
			),
		}),
		v.transform((value) => ({
			item: value.Items,
		})),
	),
	{
		abortEarly: true,
		abortPipeEarly: true,
	},
);

export declare namespace GetPublisherItemBySlugFromTable {
	type Props = { slug: string } & Partial<{
		consistentRead: boolean;
	}>;
}
