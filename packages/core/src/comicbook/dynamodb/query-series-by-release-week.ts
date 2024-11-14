import {
	makeSeriesGsi3Cursor,
	makeSeriesGsi3PartitionKey,
	makeSeriesGsi3SortKey,
	makeSeriesPk,
	makeSeriesSk,
} from './keys/series';
import {
	seriesGsi3CursorSchema,
	seriesGsi3KeysSchema,
	seriesSchema,
} from './types/series';

import { Dynamodb } from '@cbx-weekly/utils/dynamodb';

import * as v from '@cbx-weekly/valibot/core';

import type { DynamoDBClient } from '@aws-sdk/client-dynamodb';

import type { Simplify, UndefinedOnPartialDeep } from 'type-fest';

export async function querySeriesByReleaseWeek(
	props: QuerySeriesByReleaseWeek.Props,
	tableName: string,
	client: DynamoDBClient,
) {
	return Dynamodb.queryItems(
		client,
		{
			tableName,
			indexName: 'Gsi3',
			keyCondition: '#gsi3pk = :gsi3pk AND begins_with(#gsi3sk, :gsi3sk)',
			attributes: {
				names: {
					'#gsi3pk': 'Gsi3Pk',
					'#gsi3sk': 'Gsi3Sk',
				},
				values: {
					':gsi3pk': makeSeriesGsi3PartitionKey({
						releaseWeek: props.releaseWeek,
					}),
					':gsi3sk': makeSeriesGsi3SortKey({ releaseWeekday: '', slug: '' }),
				},
			},
			cursor: props.cursor,
			order: props.order,
			limit: props.limit,
			consistentRead: props.consistentRead,
		},
		seriesSchema,
		v.pipe(
			seriesGsi3CursorSchema,
			v.transform((props) => ({
				Pk: makeSeriesPk({ id: props.id }),
				Sk: makeSeriesSk(),
				Gsi3Pk: makeSeriesGsi3PartitionKey({
					releaseWeek: props.releaseDate.substring(0, 8),
				}),
				Gsi3Sk: makeSeriesGsi3SortKey({
					releaseWeekday: props.releaseDate.substring(9),
					slug: props.slug,
				}),
			})),
		),
		v.pipe(seriesGsi3KeysSchema, v.transform(makeSeriesGsi3Cursor)),
	);
}

export declare namespace QuerySeriesByReleaseWeek {
	type Props = Simplify<
		{ releaseWeek: string } & UndefinedOnPartialDeep<
			Partial<{
				cursor: string;
				order: 'asc' | 'desc';
				limit: number;
				consistentRead: boolean;
			}>
		>
	>;
}
