import { ISSUE_TABLE_ITEM_GSI2_PAGINATION_CURSOR_REGEX } from '../regex';

import {
	encodeTableItemPartitionKey,
	encodeTableItemSortKey,
} from '@cbx-weekly/backend-core-dynamodb';

import * as vx from '@cbx-weekly/shared-valibot';
import * as v from 'valibot';

import type { IssueTableItem } from '../types';

export function encodeIssueTableItemPartitionKey(
	props: Pick<IssueTableItem, 'id'>,
) {
	return encodeTableItemPartitionKey('issues', 'id', props.id);
}

export function encodeIssueTableItemSortKey() {
	return encodeTableItemSortKey();
}

export function encodeIssueTableItemGsi1PartitionKey(
	props: Pick<IssueTableItem, 'slug'>,
) {
	return encodeTableItemPartitionKey('issues', 'slug', props.slug);
}

export function encodeIssueTableItemGsi1SortKey() {
	return encodeTableItemSortKey();
}

export function encodeIssueTableItemGsi2PartitionKey(
	props: Pick<IssueTableItem, 'seriesId'>,
) {
	return encodeTableItemPartitionKey('issues', 'series-id', props.seriesId);
}

export function encodeIssueTableItemGsi2SortKey(
	props: Pick<IssueTableItem, 'slug'>,
) {
	return encodeTableItemSortKey('slug', props.slug);
}

export function encodeIssueTableItemGsi3PartitionKey(
	props: Pick<IssueTableItem, 'releaseDate'>,
) {
	return encodeTableItemPartitionKey(
		'issues',
		'release-date',
		props.releaseDate,
	);
}

export function encodeIssueTableItemGsi3SortKey(
	props: Pick<IssueTableItem, 'slug'>,
) {
	return encodeTableItemSortKey('slug', props.slug);
}

export function encodeIssueUniqueSlugTableItemPartitionKey(
	props: Pick<IssueTableItem.Unique.SlugTableItem, 'slug'>,
) {
	return encodeTableItemPartitionKey('issues', 'unq', 'slug', props.slug);
}

export function encodeIssueUniqueSlugTableItemSortKey() {
	return encodeTableItemSortKey();
}

export function encodeIssueTableItemGsi2PaginationCursor(
	props: Pick<IssueTableItem, 'id' | 'slug' | 'seriesId'>,
) {
	return encodeTableItemPartitionKey(
		'issues',
		'series-id',
		props.seriesId,
		'slug',
		props.slug,
		'id',
		props.id,
	);
}

export function encodeIssueTableItemGsi2PaginationKeys(
	props: Pick<IssueTableItem, 'id' | 'slug' | 'seriesId'>,
) {
	return {
		Pk: encodeIssueTableItemPartitionKey({ id: props.id }),
		Sk: encodeIssueTableItemSortKey(),
		Gsi2Pk: encodeIssueTableItemGsi2PartitionKey({ seriesId: props.seriesId }),
		Gsi2Sk: encodeIssueTableItemGsi2SortKey({ slug: props.slug }),
	} satisfies Pick<IssueTableItem.Raw, 'Pk' | 'Sk' | 'Gsi2Pk' | 'Gsi2Sk'>;
}
