import {
	encodeTableItemPartitionKey,
	encodeTableItemSortKey,
} from '@cbx-weekly/backend-core-dynamodb';

import type { Series } from '../types';

export function encodeSeriesTableItemPartitionKey(
	props: Pick<Series.TableItem, 'id'>,
) {
	return encodeTableItemPartitionKey('series', 'id', props.id);
}

export function encodeSeriesTableItemSortKey() {
	return encodeTableItemSortKey();
}

export function encodeSeriesTableItemGsi1PartitionKey(
	props: Pick<Series.TableItem, 'slug'>,
) {
	return encodeTableItemPartitionKey('series', 'slug', props.slug);
}

export function encodeSeriesTableItemGsi1SortKey() {
	return encodeTableItemSortKey();
}

export function encodeSeriesTableItemGsi2PartitionKey(
	props: Pick<Series.TableItem, 'publisherId'>,
) {
	return encodeTableItemPartitionKey(
		'series',
		'publisher-id',
		props.publisherId,
	);
}

export function encodeSeriesTableItemGsi2SortKey(
	props: Pick<Series.TableItem, 'slug'>,
) {
	return encodeTableItemSortKey('slug', props.slug);
}

export function encodeSeriesTableItemGsi3PartitionKey(
	props: Pick<Series.TableItem, 'releaseDate'>,
) {
	return encodeTableItemPartitionKey(
		'series',
		'release-date',
		props.releaseDate,
	);
}

export function encodeSeriesTableItemGsi3SortKey(
	props: Pick<Series.TableItem, 'slug'>,
) {
	return encodeTableItemSortKey('slug', props.slug);
}

export function encodeSeriesUniqueSlugTableItemPartitionKey(
	props: Pick<Series.Unique.Slug.TableItem, 'slug'>,
) {
	return encodeTableItemPartitionKey('series', 'unq', 'slug', props.slug);
}

export function encodeSeriesUniqueSlugTableItemSortKey() {
	return encodeTableItemSortKey();
}

export function encodeSeriesTableItemGsi2PaginationCursor(
	props: Pick<Series.TableItem, 'id' | 'slug' | 'publisherId'>,
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
