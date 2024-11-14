import { makePublisherPk, makePublisherSk } from './keys/publisher';
import { publisherSchema } from './types/publisher';

import { Dynamodb } from '@cbx-weekly/utils/dynamodb';

import type { DynamoDBClient } from '@aws-sdk/client-dynamodb';

import type { Simplify, UndefinedOnPartialDeep } from 'type-fest';

export async function getPublisherById(
	props: GetPublisherById.Props,
	tableName: string,
	client: DynamoDBClient,
) {
	return Dynamodb.getItem(
		client,
		{
			tableName,
			key: {
				Pk: makePublisherPk({ id: props.id }),
				Sk: makePublisherSk(),
			},
			consistentRead: props.consistentRead,
		},
		publisherSchema,
	).then((output) => {
		if (output.item === undefined) {
			throw Dynamodb.Errors.itemNotFound.make('publisher', { id: props.id });
		}

		return { item: output.item };
	});
}

export declare namespace GetPublisherById {
	type Props = Simplify<
		{ id: string } & UndefinedOnPartialDeep<
			Partial<{
				consistentRead: boolean;
			}>
		>
	>;
}
