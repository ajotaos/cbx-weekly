import { Dynamodb } from '@cbx-weekly/utils/dynamodb';

import type * as v_comicbook from '@cbx-weekly/valibot/comicbook';

export function makeIssuePk(props: v_comicbook.IssuePkComponents) {
	return Dynamodb.Keys.makePartitionKey('issue', 'id', props.id);
}

export function makeIssueSk() {
	return Dynamodb.Keys.makeSortKey();
}

export function makeIssueGsi1Pk(props: v_comicbook.IssueGsi1PkComponents) {
	return Dynamodb.Keys.makePartitionKey('issue', 'slug', props.slug);
}

export function makeIssueGsi1Sk() {
	return Dynamodb.Keys.makeSortKey();
}

export function makeIssueGsi2Pk(props: v_comicbook.IssueGsi2PkComponents) {
	return Dynamodb.Keys.makePartitionKey('issue', 'series-id', props.seriesId);
}

export function makeIssueGsi2Sk(props: v_comicbook.IssueGsi2SkComponents) {
	return Dynamodb.Keys.makeSortKey('slug', props.slug);
}

export function makeIssueGsi2Cursor(
	props: v_comicbook.IssueGsi2CursorComponents,
) {
	return Dynamodb.Keys.makePartitionKey(
		'issue',
		'series-id',
		props.seriesId,
		'slug',
		props.slug,
		'id',
		props.id,
	);
}

export function makeIssueGsi3PartitionKey(
	props: v_comicbook.IssueGsi3PkComponents,
) {
	return Dynamodb.Keys.makePartitionKey(
		'issue',
		'release-week',
		props.releaseWeek,
	);
}

export function makeIssueGsi3SortKey(props: v_comicbook.IssueGsi3SkComponents) {
	return Dynamodb.Keys.makeSortKey(
		'release-weekday',
		props.releaseWeekday,
		'slug',
		props.slug,
	);
}

export function makeIssueGsi3Cursor(
	props: v_comicbook.IssueGsi3CursorComponents,
) {
	return Dynamodb.Keys.makePartitionKey(
		'issue',
		'release-date',
		props.releaseDate,
		'slug',
		props.slug,
		'id',
		props.id,
	);
}
