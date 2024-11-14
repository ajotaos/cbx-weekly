import { ConditionalCheckFailedException } from '@aws-sdk/client-dynamodb';
import { DeleteCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

import type { ExpressionAttributes, Key } from './types';

import type { DynamoDBClient } from '@aws-sdk/client-dynamodb';

import type { UndefinedOnPartialDeep } from 'type-fest';

export type DeleteItemInput = {
	tableName: string;
	key: Key;
	condition?: string | undefined;
	attributes?:
		| UndefinedOnPartialDeep<Partial<ExpressionAttributes>>
		| undefined;
};

export type ErrorRemapper = (error: ConditionalCheckFailedException) => never;

export async function deleteItem(
	client: DynamoDBClient,
	input: DeleteItemInput,
	errorRemapper?: ErrorRemapper,
) {
	const documentClient = DynamoDBDocumentClient.from(client);

	const command = new DeleteCommand({
		TableName: input.tableName,
		Key: input.key,
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
