import {
	makeSeriesGsi2Cursor,
	makeSeriesGsi2Pk,
	makeSeriesGsi2Sk,
	makeSeriesPk,
	makeSeriesSk,
} from './keys/series';
import {
	seriesGsi2CursorSchema,
	seriesGsi2KeysSchema,
	seriesSchema,
} from './types/series';

import { Dynamodb } from '@cbx-weekly/utils/dynamodb';

import * as v from '@cbx-weekly/valibot/core';

import type { DynamoDBClient } from '@aws-sdk/client-dynamodb';

import type { Simplify, UndefinedOnPartialDeep } from 'type-fest';

export async function querySeriesByPublisherId(
	props: QuerySeriesByPublisherId.Props,
	tableName: string,
	client: DynamoDBClient,
) {
	return Dynamodb.queryItems(
		client,
		{
			tableName,
			indexName: 'Gsi2',
			keyCondition: '#gsi2pk = :gsi2pk AND begins_with(#gsi2sk, :gsi2sk)',
			attributes: {
				names: {
					'#gsi2pk': 'Gsi2Pk',
					'#gsi2sk': 'Gsi2Sk',
				},
				values: {
					':gsi2pk': makeSeriesGsi2Pk({
						publisherId: props.publisherId,
					}),
					':gsi2sk': makeSeriesGsi2Sk({ slug: '' }),
				},
			},
			cursor: props.cursor,
			order: props.order,
			limit: props.limit,
			consistentRead: props.consistentRead,
		},
		seriesSchema,
		v.pipe(
			seriesGsi2CursorSchema,
			v.transform((props) => ({
				Pk: makeSeriesPk({ id: props.id }),
				Sk: makeSeriesSk(),
				Gsi2Pk: makeSeriesGsi2Pk({ publisherId: props.publisherId }),
				Gsi2Sk: makeSeriesGsi2Sk({ slug: props.slug }),
			})),
		),
		v.pipe(seriesGsi2KeysSchema, v.transform(makeSeriesGsi2Cursor)),
	);
}

export declare namespace QuerySeriesByPublisherId {
	type Props = Simplify<
		{ publisherId: string } & UndefinedOnPartialDeep<
			Partial<{
				cursor: string;
				order: 'asc' | 'desc';
				limit: number;
				consistentRead: boolean;
			}>
		>
	>;
}
