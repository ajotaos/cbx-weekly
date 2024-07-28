import { SERIES_TABLE_ITEM_GSI2_PAGINATION_CURSOR_REGEX } from '../regex';

import {
	encodeTableItemPartitionKey,
	encodeTableItemSortKey,
} from '@cbx-weekly/backend-core-dynamodb';

import * as vx from '@cbx-weekly/shared-valibot';
import * as v from 'valibot';

import type { SeriesTableItem } from '../types';

export function encodeSeriesTableItemPartitionKey(
	props: Pick<SeriesTableItem, 'id'>,
) {
	return encodeTableItemPartitionKey('series', 'id', props.id);
}

export function encodeSeriesTableItemSortKey() {
	return encodeTableItemSortKey();
}

export function encodeSeriesTableItemGsi1PartitionKey(
	props: Pick<SeriesTableItem, 'slug'>,
) {
	return encodeTableItemPartitionKey('series', 'slug', props.slug);
}

export function encodeSeriesTableItemGsi1SortKey() {
	return encodeTableItemSortKey();
}

export function encodeSeriesTableItemGsi2PartitionKey(
	props: Pick<SeriesTableItem, 'publisherId'>,
) {
	return encodeTableItemPartitionKey(
		'series',
		'publisher-id',
		props.publisherId,
	);
}

export function encodeSeriesTableItemGsi2SortKey(
	props: Pick<SeriesTableItem, 'slug'>,
) {
	return encodeTableItemSortKey('slug', props.slug);
}

export function encodeSeriesTableItemGsi3PartitionKey(
	props: Pick<SeriesTableItem, 'releaseDate'>,
) {
	return encodeTableItemPartitionKey(
		'series',
		'release-date',
		props.releaseDate,
	);
}

export function encodeSeriesTableItemGsi3SortKey(
	props: Pick<SeriesTableItem, 'slug'>,
) {
	return encodeTableItemSortKey('slug', props.slug);
}

export function encodeSeriesUniqueSlugTableItemPartitionKey(
	props: Pick<SeriesTableItem.Unique.SlugTableItem, 'slug'>,
) {
	return encodeTableItemPartitionKey('series', 'unq', 'slug', props.slug);
}

export function encodeSeriesUniqueSlugTableItemSortKey() {
	return encodeTableItemSortKey();
}

export function encodeSeriesTableItemGsi2PaginationCursor(
	props: Pick<SeriesTableItem, 'id' | 'slug' | 'publisherId'>,
) {
	return encodeTableItemPartitionKey(
		'series',
		'publisher-id',
		props.publisherId,
		'slug',
		props.slug,
		'id',
		props.id,
	);
}

export function encodeSeriesTableItemGsi2PaginationKeys(
	props: Pick<SeriesTableItem, 'id' | 'slug' | 'publisherId'>,
) {
	return {
		Pk: encodeSeriesTableItemPartitionKey({ id: props.id }),
		Sk: encodeSeriesTableItemSortKey(),
		Gsi2Pk: encodeSeriesTableItemGsi2PartitionKey({
			publisherId: props.publisherId,
		}),
		Gsi2Sk: encodeSeriesTableItemGsi2SortKey({ slug: props.slug }),
	} satisfies Pick<SeriesTableItem.Raw, 'Pk' | 'Sk' | 'Gsi2Pk' | 'Gsi2Sk'>;
}
