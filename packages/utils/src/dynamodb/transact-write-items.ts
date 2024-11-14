import {
	DynamoDBDocumentClient,
	TransactWriteCommand,
} from '@aws-sdk/lib-dynamodb';

import { TransactionCanceledException } from '@aws-sdk/client-dynamodb';

import type { ExpressionAttributes, Item, Key } from './types';

import type { TransactWriteCommandInput } from '@aws-sdk/lib-dynamodb';

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

export type ConditionCheckItemInput = {
	tableName: string;
	key: Key;
	condition?: string | undefined;
	attributes?:
		| UndefinedOnPartialDeep<Partial<ExpressionAttributes>>
		| undefined;
};

export type UpdateItemInput = {
	tableName: string;
	key: Key;
	update: string;
	condition?: string | undefined;
	attributes?:
		| UndefinedOnPartialDeep<Partial<ExpressionAttributes>>
		| undefined;
};

export type DeleteCheckItemInput = {
	tableName: string;
	key: Key;
	condition?: string | undefined;
	attributes?:
		| UndefinedOnPartialDeep<Partial<ExpressionAttributes>>
		| undefined;
};

export type ErrorRemapper = (error: TransactionCanceledException) => never;

type OperationParams = NonNullable<
	TransactWriteCommandInput['TransactItems']
>[number];

type Operation = {
	operation: OperationParams;
	errorRemapper?: ErrorRemapper | undefined;
};

class TransactionWriteBuilder {
	private operations: Operation[] = [];

	constructor(private readonly client: DynamoDBDocumentClient) {}

	put(input: PutItemInput, errorRemapper?: ErrorRemapper) {
		this.operations.push({
			operation: {
				Put: {
					TableName: input.tableName,
					Item: input.item,
					ConditionExpression: input.condition as string,
					ExpressionAttributeNames: input.attributes
						?.names as ExpressionAttributes['names'],
					ExpressionAttributeValues: input.attributes
						?.values as ExpressionAttributes['values'],
				},
			},
			errorRemapper,
		});
	}

	conditionCheck(
		input: ConditionCheckItemInput,
		errorRemapper?: ErrorRemapper,
	) {
		this.operations.push({
			operation: {
				ConditionCheck: {
					TableName: input.tableName,
					Key: input.key,
					ConditionExpression: input.condition as string,
					ExpressionAttributeNames: input.attributes
						?.names as ExpressionAttributes['names'],
					ExpressionAttributeValues: input.attributes
						?.values as ExpressionAttributes['values'],
				},
			},
			errorRemapper,
		});
	}

	update(input: UpdateItemInput, errorRemapper?: ErrorRemapper) {
		this.operations.push({
			operation: {
				Update: {
					TableName: input.tableName,
					Key: input.key,
					UpdateExpression: input.update,
					ConditionExpression: input.condition as string,
					ExpressionAttributeNames: input.attributes
						?.names as ExpressionAttributes['names'],
					ExpressionAttributeValues: input.attributes
						?.values as ExpressionAttributes['values'],
				},
			},
			errorRemapper,
		});
	}

	delete(input: DeleteCheckItemInput, errorRemapper?: ErrorRemapper) {
		this.operations.push({
			operation: {
				Delete: {
					TableName: input.tableName,
					Key: input.key,
					ConditionExpression: input.condition as string,
					ExpressionAttributeNames: input.attributes
						?.names as ExpressionAttributes['names'],
					ExpressionAttributeValues: input.attributes
						?.values as ExpressionAttributes['values'],
				},
			},
			errorRemapper,
		});
	}

	async execute() {
		const command = new TransactWriteCommand({
			TransactItems: this.operations.map((op) => op.operation),
		});

		await this.client.send(command).catch((error) => {
			if (
				error instanceof TransactionCanceledException &&
				error.CancellationReasons !== undefined
			) {
				for (let index = 0; index < error.CancellationReasons.length; index++) {
					const reason = error.CancellationReasons[index];
					if (
						reason !== undefined &&
						reason.Code === 'ConditionalCheckFailed' &&
						this.operations[index]?.errorRemapper !== undefined
					) {
						// biome-ignore lint/style/noNonNullAssertion: <explanation>
						this.operations[index]!.errorRemapper!(error);
					}
				}
			}

			throw error;
		});
	}
}

export function createTransactionWriteBuilder(client: DynamoDBClient) {
	const documentClient = DynamoDBDocumentClient.from(client);

	return new TransactionWriteBuilder(documentClient);
}
