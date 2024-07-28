import { PUBLISHER_TABLE_ITEM_GSI2_PAGINATION_CURSOR_REGEX } from '../regex';

import {
	encodeTableItemPartitionKey,
	encodeTableItemSortKey,
} from '@cbx-weekly/backend-core-dynamodb';

import * as vx from '@cbx-weekly/shared-valibot';
import * as v from 'valibot';

import type { PublisherTableItem } from '../types';

export function encodePublisherTableItemPartitionKey(
	props: Pick<PublisherTableItem, 'id'>,
) {
	return encodeTableItemPartitionKey('publishers', 'id', props.id);
}

export function encodePublisherTableItemSortKey() {
	return encodeTableItemSortKey();
}

export function encodePublisherTableItemGsi1PartitionKey(
	props: Pick<PublisherTableItem, 'slug'>,
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
	props: Pick<PublisherTableItem, 'slug'>,
) {
	return encodeTableItemSortKey('slug', props.slug);
}

export function encodePublisherUniqueSlugTableItemPartitionKey(
	props: Pick<PublisherTableItem.Unique.SlugTableItem, 'slug'>,
) {
	return encodeTableItemPartitionKey('publishers', 'unq', 'slug', props.slug);
}

export function encodePublisherUniqueSlugTableItemSortKey() {
	return encodeTableItemSortKey();
}

export function encodePublisherTableItemGsi2PaginationCursor(
	props: Pick<PublisherTableItem, 'id' | 'slug'>,
) {
	return encodeTableItemPartitionKey(
		'publishers',
		'slug',
		props.slug,
		'id',
		props.id,
	);
}

export function encodePublisherTableItemGsi2PaginationKeys(
	props: Pick<PublisherTableItem, 'id' | 'slug'>,
) {
	return {
		Pk: encodePublisherTableItemPartitionKey({ id: props.id }),
		Sk: encodePublisherTableItemSortKey(),
		Gsi2Pk: encodePublisherTableItemGsi2PartitionKey(),
		Gsi2Sk: encodePublisherTableItemGsi2SortKey({ slug: props.slug }),
	} satisfies Pick<PublisherTableItem.Raw, 'Pk' | 'Sk' | 'Gsi2Pk' | 'Gsi2Sk'>;
}
