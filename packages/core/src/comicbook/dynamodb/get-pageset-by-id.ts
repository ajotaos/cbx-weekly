import { makePagesetPk, makePagesetSk } from './keys/pageset';
import { pagesetSchema } from './types/pageset';

import { Dynamodb } from '@cbx-weekly/utils/dynamodb';

import type { DynamoDBClient } from '@aws-sdk/client-dynamodb';

import type { Simplify, UndefinedOnPartialDeep } from 'type-fest';

export async function getPagesetById(
	props: GetPagesetById.Props,
	tableName: string,
	client: DynamoDBClient,
) {
	return Dynamodb.getItem(
		client,
		{
			tableName,
			key: {
				Pk: makePagesetPk({ id: props.id }),
				Sk: makePagesetSk(),
			},
			consistentRead: props.consistentRead,
		},
		pagesetSchema,
	).then((output) => {
		if (output.item === undefined) {
			throw Dynamodb.Errors.itemNotFound.make('pageset', { id: props.id });
		}

		return { item: output.item };
	});
}

export declare namespace GetPagesetById {
	type Props = Simplify<
		{ id: string } & UndefinedOnPartialDeep<
			Partial<{
				consistentRead: boolean;
			}>
		>
	>;
}
