import { publisherTableItemSchema } from '../types';

import {
	encodePublisherTableItemPartitionKey,
	encodePublisherTableItemSortKey,
} from '../keys';

import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';

import * as v from '@cbx-weekly/backend-core-valibot';

import { throwItemNotFoundError } from '@cbx-weekly/backend-core-dynamodb';

import type { Publisher } from '../types';

import type { DynamoDBClient } from '@aws-sdk/client-dynamodb';

import type { Simplify } from 'type-fest';

export async function getPublisherItemByIdFromTable(
	props: GetPublisherItemByIdFromTable.Props,
	tableName: string,
	client: DynamoDBClient,
) {
	const documentClient = DynamoDBDocumentClient.from(client);

	const { id, consistentRead } = parseProps(props);

	return documentClient
		.send(
			new GetCommand({
				TableName: tableName,
				Key: {
					Pk: encodePublisherTableItemPartitionKey({ id }),
					Sk: encodePublisherTableItemSortKey(),
				} satisfies Pick<Publisher.TableItem.Raw, 'Pk' | 'Sk'>,
				ConsistentRead: consistentRead,
			}),
		)
		.then(({ Item }) => {
			const item = parseItem(Item);

			if (item === undefined) {
				throwItemNotFoundError('publisher', { id });
			}

			return { item };
		});
}

const parseProps = v.parser(
	v.strictObject({
		id: v.pipe(v.string(), v.id()),
		consistentRead: v.optional(v.boolean()),
	}),
);

const parseItem = v.parser(v.optional(publisherTableItemSchema));

export declare namespace GetPublisherItemByIdFromTable {
	type Props = Simplify<
		{ id: string } & Partial<{
			consistentRead: boolean;
		}>
	>;
}
