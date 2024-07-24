import { publisherTableItemSchema } from '../types';

import {
	encodePublisherTableItemGsi1PartitionKey,
	encodePublisherTableItemGsi1SortKey,
} from '../keys';

import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';

import * as v from '@cbx-weekly/backend-core-valibot';

import { throwItemNotFoundError } from '@cbx-weekly/backend-core-dynamodb';

import type { DynamoDBClient } from '@aws-sdk/client-dynamodb';

import type { Simplify } from 'type-fest';

export async function getPublisherItemBySlugFromTable(
	props: GetPublisherItemBySlugFromTable.Props,
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
					':gsi1pk': encodePublisherTableItemGsi1PartitionKey({ slug }),
					':gsi1sk': encodePublisherTableItemGsi1SortKey(),
				},
				KeyConditionExpression: '#gsi1pk = :gsi1pk AND #gsi1sk = :gsi1sk',
				ConsistentRead: consistentRead,
				Limit: 1,
			}),
		)
		.then(({ Items }) => {
			const item = parseItem(Items?.at(0));

			if (item === undefined) {
				throwItemNotFoundError('publisher', { slug });
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

const parseItem = v.parser(v.optional(publisherTableItemSchema));

export declare namespace GetPublisherItemBySlugFromTable {
	type Props = Simplify<
		{ slug: string } & Partial<{
			consistentRead: boolean;
		}>
	>;
}
