import {
	encodeTableItemPartitionKey,
	encodeTableItemSortKey,
} from '@cbx-weekly/backend-core-dynamodb';

import type { Publisher } from '../types';

export function encodePublisherTableItemPartitionKey(
	props: Pick<Publisher.TableItem, 'id'>,
) {
	return encodeTableItemPartitionKey('publishers', 'id', props.id);
}

export function encodePublisherTableItemSortKey() {
	return encodeTableItemSortKey();
}

export function encodePublisherTableItemGsi1PartitionKey(
	props: Pick<Publisher.TableItem, 'slug'>,
) {
	return encodeTableItemPartitionKey('publishers', 'slug', props.slug);
}

export function encodePublisherTableItemGsi1SortKey() {
	return encodeTableItemSortKey();
}

export function encodePublisherTableItemGsi2PartitionKey() {
	return encodeTableItemPartitionKey('publishers');
}

export function encodePublisherTableItemGsi2SortKey(
	props: Pick<Publisher.TableItem, 'slug'>,
) {
	return encodeTableItemSortKey('slug', props.slug);
}

export function encodePublisherUniqueSlugTableItemPartitionKey(
	props: Pick<Publisher.Unique.Slug.TableItem, 'slug'>,
) {
	return encodeTableItemPartitionKey('publishers', 'unq', 'slug', props.slug);
}

export function encodePublisherUniqueSlugTableItemSortKey() {
	return encodeTableItemSortKey();
}

export function encodePublisherTableItemGsi2PaginationCursor(
	props: Pick<Publisher.TableItem, 'id' | 'slug'>,
) {
	return encodeTableItemPartitionKey(
		'publishers',
		'slug',
		props.slug,
		'id',
		props.id,
	);
}
