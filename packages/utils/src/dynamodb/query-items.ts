import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';

import * as v from '@cbx-weekly/valibot/core';

import type { ExpressionAttributes, Item, Key, Order } from './types';

import type { DynamoDBClient } from '@aws-sdk/client-dynamodb';

import type { GenericSchema, InferOutput } from '@cbx-weekly/valibot/core';

import type { UndefinedOnPartialDeep } from 'type-fest';

export type QueryItemsInput = {
	tableName: string;
	indexName?: string | undefined;
	keyCondition: string;
	filter?: string | undefined;
	attributes?:
		| UndefinedOnPartialDeep<Partial<ExpressionAttributes>>
		| undefined;
	cursor?: string | undefined;
	order?: Order | undefined;
	limit?: number | undefined;
	consistentRead?: boolean | undefined;
};

export type QueryItemsOutput<TItem extends Item> = {
	items: Array<TItem>;
	cursor?: string | undefined;
};

export async function queryItems<
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	TItemSchema extends GenericSchema<Item, any>,
	TKey extends Key,
	TCursorDecoderSchema extends GenericSchema<string, TKey>,
	TCursorEncoderSchema extends GenericSchema<TKey, string>,
>(
	client: DynamoDBClient,
	input: QueryItemsInput,
	itemSchema: TItemSchema,
	cursorDecoderSchema: TCursorDecoderSchema,
	cursorEncoderSchema: TCursorEncoderSchema,
): Promise<QueryItemsOutput<InferOutput<TItemSchema>>> {
	const documentClient = DynamoDBDocumentClient.from(client);

	const command = new QueryCommand({
		TableName: input.tableName,
		IndexName: input.indexName as string,
		KeyConditionExpression: input.keyCondition,
		FilterExpression: input.filter,
		ExpressionAttributeNames: input.attributes
			?.names as ExpressionAttributes['names'],
		ExpressionAttributeValues: input.attributes
			?.values as ExpressionAttributes['values'],
		ExclusiveStartKey: v.parse(
			v.optional(cursorDecoderSchema),
			input.cursor,
		) as TKey,
		ScanIndexForward: input.order !== 'desc',
		Limit: input.limit as number,
		ConsistentRead: input.consistentRead as boolean,
	});

	return documentClient.send(command).then((output) => ({
		items: v.parse(v.array(itemSchema), output.Items),
		cursor: v.parse(v.optional(cursorEncoderSchema), output.LastEvaluatedKey),
	}));
}
