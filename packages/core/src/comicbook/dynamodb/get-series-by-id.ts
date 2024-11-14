import { makeSeriesPk, makeSeriesSk } from './keys/series';
import { seriesSchema } from './types/series';

import { Dynamodb } from '@cbx-weekly/utils/dynamodb';

import type { DynamoDBClient } from '@aws-sdk/client-dynamodb';

import type { Simplify, UndefinedOnPartialDeep } from 'type-fest';

export async function getSeriesById(
	props: GetSeriesById.Props,
	tableName: string,
	client: DynamoDBClient,
) {
	return Dynamodb.getItem(
		client,
		{
			tableName,
			key: {
				Pk: makeSeriesPk({ id: props.id }),
				Sk: makeSeriesSk(),
			},
			consistentRead: props.consistentRead,
		},
		seriesSchema,
	).then((output) => {
		if (output.item === undefined) {
			throw Dynamodb.Errors.itemNotFound.make('series', { id: props.id });
		}

		return { item: output.item };
	});
}

export declare namespace GetSeriesById {
	type Props = Simplify<
		{ id: string } & UndefinedOnPartialDeep<
			Partial<{
				consistentRead: boolean;
			}>
		>
	>;
}
