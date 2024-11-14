import { makeSeriesGsi1Pk, makeSeriesGsi1Sk } from './keys/series';
import { seriesSchema } from './types/series';

import { makeSeriesSlug } from './slugs/series';

import { Dynamodb } from '@cbx-weekly/utils/dynamodb';

import * as v from '@cbx-weekly/valibot/core';

import type { DynamoDBClient } from '@aws-sdk/client-dynamodb';

import type { Simplify, UndefinedOnPartialDeep } from 'type-fest';

import type * as v_comicbook from '@cbx-weekly/valibot/comicbook';

export async function getSeriesByTitle(
	props: GetSeriesByTitle.Props,
	tableName: string,
	client: DynamoDBClient,
) {
	const slug = makeSeriesSlug(props.title);

	return Dynamodb.queryItems(
		client,
		{
			tableName,
			indexName: 'Gsi1',
			keyCondition: '#gsi1pk = :gsi1pk AND #gsi1sk = :gsi1sk',
			filter:
				'#title.#publisher = :titlePublisher AND #title.#name = :titleName',
			attributes: {
				names: {
					'#gsi1pk': 'Gsi1Pk',
					'#gsi1sk': 'Gsi1Sk',
					'#title': 'Title',
					'#publisher': 'Publisher',
					'#name': 'Name',
				},
				values: {
					':gsi1pk': makeSeriesGsi1Pk({ slug }),
					':gsi1sk': makeSeriesGsi1Sk(),
					':titlePublisher': props.title.publisher,
					':titleName': props.title.name,
				},
			},
			limit: 1,
			consistentRead: props.consistentRead,
		},
		seriesSchema,
		v.any(),
		v.any(),
	).then((output) => {
		if (output.items.length === 0) {
			throw Dynamodb.Errors.itemNotFound.make('series', {
				title: {
					publisher: props.title.publisher,
					name: props.title.name,
				},
			});
		}

		return { item: output.items[0] };
	});
}

export declare namespace GetSeriesByTitle {
	type Props = Simplify<
		{ title: v_comicbook.SeriesTitleComponents } & UndefinedOnPartialDeep<
			Partial<{
				consistentRead: boolean;
			}>
		>
	>;
}
