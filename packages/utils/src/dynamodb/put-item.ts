import { ConditionalCheckFailedException } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';

import type { ExpressionAttributes, Item } from './types';

import type { DynamoDBClient } from '@aws-sdk/client-dynamodb';

import type { UndefinedOnPartialDeep } from 'type-fest';

export type PutItemInput = {
	tableName: string;
	item: Item;
	condition?: string | undefined;
	attributes?:
		| UndefinedOnPartialDeep<Partial<ExpressionAttributes>>
		| undefined;
};

export type ErrorRemapper = (error: ConditionalCheckFailedException) => never;

export async function putItem(
	client: DynamoDBClient,
	input: PutItemInput,
	errorRemapper?: ErrorRemapper,
) {
	const documentClient = DynamoDBDocumentClient.from(client);

	const command = new PutCommand({
		TableName: input.tableName,
		Item: input.item,
		ConditionExpression: input.condition as string,
		ExpressionAttributeNames: input.attributes
			?.names as ExpressionAttributes['names'],
		ExpressionAttributeValues: input.attributes
			?.values as ExpressionAttributes['values'],
	});

	await documentClient.send(command).catch((error) => {
		if (error instanceof ConditionalCheckFailedException) {
			if (errorRemapper) {
				throw errorRemapper(error);
			}
		}

		throw error;
	});
}
