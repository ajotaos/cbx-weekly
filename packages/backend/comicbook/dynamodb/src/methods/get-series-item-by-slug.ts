import { seriesTableItemSchema } from '../types';

import {
	encodeSeriesTableItemGsi1PartitionKey,
	encodeSeriesTableItemGsi1SortKey,
} from '../keys';

import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';

import * as v from '@cbx-weekly/backend-core-valibot';

import { throwItemNotFoundError } from '@cbx-weekly/backend-core-dynamodb';

import type { DynamoDBClient } from '@aws-sdk/client-dynamodb';

import type { Simplify } from 'type-fest';

export async function getSeriesItemBySlugFromTable(
	props: GetSeriesItemBySlugFromTable.Props,
	tableName: string,
	client: DynamoDBClient,
) {
	const documentClient = DynamoDBDocumentClient.from(client);

	const { slug, consistentRead } = parseProps(props);

	return documentClient
		.send(
			new QueryCommand({
				TableName: tableName,
				IndexName: 'Gsi1',
				ExpressionAttributeNames: {
					'#gsi1pk': 'Gsi1Pk',
					'#gsi1sk': 'Gsi1Sk',
				},
				ExpressionAttributeValues: {
					':gsi1pk': encodeSeriesTableItemGsi1PartitionKey({ slug }),
					':gsi1sk': encodeSeriesTableItemGsi1SortKey(),
				},
				KeyConditionExpression: '#gsi1pk = :gsi1pk AND #gsi1sk = :gsi1sk',
				ConsistentRead: consistentRead,
				Limit: 1,
			}),
		)
		.then(({ Items }) => {
			const item = parseItem(Items?.at(0));

			if (item === undefined) {
				throwItemNotFoundError('series', { slug });
			}

			return { item };
		});
}

const parseProps = v.parser(
	v.strictObject({
		slug: v.pipe(v.string(), v.slug()),
		consistentRead: v.optional(v.boolean()),
	}),
);

const parseItem = v.parser(v.optional(seriesTableItemSchema));

export declare namespace GetSeriesItemBySlugFromTable {
	type Props = Simplify<
		{ slug: string } & Partial<{
			consistentRead: boolean;
		}>
	>;
}
