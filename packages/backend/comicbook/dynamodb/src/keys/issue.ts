import {
	encodeTableItemPartitionKey,
	encodeTableItemSortKey,
} from '@cbx-weekly/backend-core-dynamodb';

import type { Issue } from '../types';

export function encodeIssueTableItemPartitionKey(
	props: Pick<Issue.TableItem, 'id'>,
) {
	return encodeTableItemPartitionKey('issues', 'id', props.id);
}

export function encodeIssueTableItemSortKey() {
	return encodeTableItemSortKey();
}

export function encodeIssueTableItemGsi1PartitionKey(
	props: Pick<Issue.TableItem, 'slug'>,
) {
	return encodeTableItemPartitionKey('issues', 'slug', props.slug);
}

export function encodeIssueTableItemGsi1SortKey() {
	return encodeTableItemSortKey();
}

export function encodeIssueTableItemGsi2PartitionKey(
	props: Pick<Issue.TableItem, 'seriesId'>,
) {
	return encodeTableItemPartitionKey('issues', 'series-id', props.seriesId);
}

export function encodeIssueTableItemGsi2SortKey(
	props: Pick<Issue.TableItem, 'slug'>,
) {
	return encodeTableItemSortKey('slug', props.slug);
}

export function encodeIssueTableItemGsi3PartitionKey(
	props: Pick<Issue.TableItem, 'releaseDate'>,
) {
	return encodeTableItemPartitionKey(
		'issues',
		'release-date',
		props.releaseDate,
	);
}

export function encodeIssueTableItemGsi3SortKey(
	props: Pick<Issue.TableItem, 'slug'>,
) {
	return encodeTableItemSortKey('slug', props.slug);
}

export function encodeIssueUniqueSlugTableItemPartitionKey(
	props: Pick<Issue.Unique.Slug.TableItem, 'slug'>,
) {
	return encodeTableItemPartitionKey('issues', 'unq', 'slug', props.slug);
}

export function encodeIssueUniqueSlugTableItemSortKey() {
	return encodeTableItemSortKey();
}

export function encodeIssueTableItemGsi2PaginationCursor(
	props: Pick<Issue.TableItem, 'id' | 'slug' | 'seriesId'>,
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
