import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';

import * as v from '@cbx-weekly/valibot/core';

import type { Item, Key } from './types';

import type { DynamoDBClient } from '@aws-sdk/client-dynamodb';

import type { GenericSchema, InferOutput } from '@cbx-weekly/valibot/core';

export type GetItemInput = {
	tableName: string;
	key: Key;
	consistentRead?: boolean | undefined;
};

export type GetItemOutput<TItem extends Item> = {
	item?: TItem;
};

export async function getItem<
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	TItemSchema extends GenericSchema<Item, any>,
>(
	client: DynamoDBClient,
	input: GetItemInput,
	itemSchema: TItemSchema,
): Promise<GetItemOutput<InferOutput<TItemSchema>>> {
	const documentClient = DynamoDBDocumentClient.from(client);

	const command = new GetCommand({
		TableName: input.tableName,
		Key: input.key,
		ConsistentRead: input.consistentRead as boolean,
	});

	return documentClient
		.send(command)
		.then((output) => ({ item: v.parse(v.optional(itemSchema), output.Item) }));
}
