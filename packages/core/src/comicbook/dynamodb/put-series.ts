import { makePublisherPk, makePublisherSk } from './keys/publisher';
import {
	makeSeriesGsi1Pk,
	makeSeriesGsi1Sk,
	makeSeriesGsi2Pk,
	makeSeriesGsi2Sk,
	makeSeriesGsi3PartitionKey,
	makeSeriesGsi3SortKey,
	makeSeriesPk,
	makeSeriesSk,
} from './keys/series';
import {
	makeSeriesUniqueSlugPartitionKey,
	makeSeriesUniqueSlugSortKey,
} from './keys/series-unq-slug';

import { makeSeriesSlug } from './slugs/series';

import { Dynamodb } from '@cbx-weekly/utils/dynamodb';

import * as v_comicbook from '@cbx-weekly/valibot/comicbook';
import * as v from '@cbx-weekly/valibot/core';

import { ulid } from 'ulidx';

import type { DynamoDBClient } from '@aws-sdk/client-dynamodb';

export async function putSeries(
	props: PutSeries.Props,
	tableName: string,
	client: DynamoDBClient,
) {
	const publisherId = parsePublisherId(props.publisherId);

	const transaction = Dynamodb.createTransactionWriteBuilder(client);

	const title = parseSeriesTitle(props.title);

	transaction.conditionCheck(
		{
			tableName,
			key: {
				Pk: makePublisherPk({ id: publisherId }),
				Sk: makePublisherSk(),
			},
			condition: 'attribute_exists(#pk) AND #title.#name = :titleName',
			attributes: {
				names: {
					'#pk': 'Pk',
					'#title': 'Title',
					'#name': 'Name',
				},
				values: {
					':titleName': title.publisher,
				},
			},
		},
		() => {
			throw Dynamodb.Errors.itemNotFound.make('publisher', {
				id: publisherId,
				title: {
					name: title.publisher,
				},
			});
		},
	);

	const id = makeSeriesId();
	const slug = makeSeriesSlug(title);

	const releaseDate = parseReleaseDate(props.releaseDate);

	transaction.put(
		{
			tableName,
			item: {
				Pk: makeSeriesPk({ id }),
				Sk: makeSeriesSk(),
				Gsi1Pk: makeSeriesGsi1Pk({ slug }),
				Gsi1Sk: makeSeriesGsi1Sk(),
				Gsi2Pk: makeSeriesGsi2Pk({ publisherId }),
				Gsi2Sk: makeSeriesGsi2Sk({ slug }),
				Gsi3Pk: makeSeriesGsi3PartitionKey({
					releaseWeek: releaseDate.substring(0, 8),
				}),
				Gsi3Sk: makeSeriesGsi3SortKey({
					releaseWeekday: releaseDate.substring(9),
					slug,
				}),
				Id: id,
				Slug: slug,
				Title: {
					Publisher: title.publisher,
					Name: title.name,
				},
				ReleaseDate: releaseDate,
				PublisherId: publisherId,
			},
			condition: 'attribute_not_exists(#pk)',
			attributes: {
				names: {
					'#pk': 'Pk',
				},
			},
		},
		() => {
			throw Dynamodb.Errors.itemAlreadyExists.make('series', { id });
		},
	);

	transaction.put(
		{
			tableName,
			item: {
				Pk: makeSeriesUniqueSlugPartitionKey({ slug }),
				Sk: makeSeriesUniqueSlugSortKey(),
				Slug: slug,
				SeriesId: id,
			},
			condition: 'attribute_not_exists(#pk)',
			attributes: {
				names: {
					'#pk': 'Pk',
				},
			},
		},
		() => {
			throw Dynamodb.Errors.itemAlreadyExists.make('series', { slug });
		},
	);

	await transaction.execute();

	return { item: { id } };
}

function makeSeriesId() {
	return ulid().toLowerCase();
}

const parseSeriesTitle = v.parser(v_comicbook.seriesTitleComponentsSchema);
const parseReleaseDate = v.parser(v.pipe(v.string(), v.isoWeekDate()));
const parsePublisherId = v.parser(v.pipe(v.string(), v.id()));

export declare namespace PutSeries {
	type Props = {
		title: v_comicbook.SeriesTitleComponents;
		releaseDate: string;
		publisherId: string;
	};
}
