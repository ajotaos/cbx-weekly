import { Dynamodb } from '@cbx-weekly/utils/dynamodb';

import type * as v_comicbook from '@cbx-weekly/valibot/comicbook';

export function makeSeriesPk(props: v_comicbook.SeriesPkComponents) {
	return Dynamodb.Keys.makePartitionKey('series', 'id', props.id);
}

export function makeSeriesSk() {
	return Dynamodb.Keys.makeSortKey();
}

export function makeSeriesGsi1Pk(props: v_comicbook.SeriesGsi1PkComponents) {
	return Dynamodb.Keys.makePartitionKey('series', 'slug', props.slug);
}

export function makeSeriesGsi1Sk() {
	return Dynamodb.Keys.makeSortKey();
}

export function makeSeriesGsi2Pk(props: v_comicbook.SeriesGsi2PkComponents) {
	return Dynamodb.Keys.makePartitionKey(
		'series',
		'publisher-id',
		props.publisherId,
	);
}

export function makeSeriesGsi2Sk(props: v_comicbook.SeriesGsi2SkComponents) {
	return Dynamodb.Keys.makeSortKey('slug', props.slug);
}

export function makeSeriesGsi2Cursor(
	props: v_comicbook.SeriesGsi2CursorComponents,
) {
	return Dynamodb.Keys.makePartitionKey(
		'series',
		'publisher-id',
		props.publisherId,
		'slug',
		props.slug,
		'id',
		props.id,
	);
}

export function makeSeriesGsi3PartitionKey(
	props: v_comicbook.SeriesGsi3PkComponents,
) {
	return Dynamodb.Keys.makePartitionKey(
		'series',
		'release-week',
		props.releaseWeek,
	);
}

export function makeSeriesGsi3SortKey(
	props: v_comicbook.SeriesGsi3SkComponents,
) {
	return Dynamodb.Keys.makeSortKey(
		'release-weekday',
		props.releaseWeekday,
		'slug',
		props.slug,
	);
}

export function makeSeriesGsi3Cursor(
	props: v_comicbook.SeriesGsi3CursorComponents,
) {
	return Dynamodb.Keys.makePartitionKey(
		'series',
		'release-date',
		props.releaseDate,
		'slug',
		props.slug,
		'id',
		props.id,
	);
}
