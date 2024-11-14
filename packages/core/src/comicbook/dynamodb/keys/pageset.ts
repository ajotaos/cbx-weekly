import { Dynamodb } from '@cbx-weekly/utils/dynamodb';

import type * as v_comicbook from '@cbx-weekly/valibot/comicbook';

export function makePagesetPk(props: v_comicbook.PagesetPkComponents) {
	return Dynamodb.Keys.makePartitionKey('pageset', 'id', props.id);
}

export function makePagesetSk() {
	return Dynamodb.Keys.makeSortKey();
}

export function makePagesetGsi1Pk(props: v_comicbook.PagesetGsi1PkComponents) {
	return Dynamodb.Keys.makePartitionKey('pageset', 'issue-id', props.issueId);
}

export function makePagesetGsi1Sk(props: v_comicbook.PagesetGsi1SkComponents) {
	return Dynamodb.Keys.makeSortKey('created', 'epoch', props.created);
}

export function makePagesetGsi1Cursor(
	props: v_comicbook.PagesetGsi1CursorComponents,
) {
	return Dynamodb.Keys.makePartitionKey(
		'pageset',
		'issue-id',
		props.issueId,
		'created',
		'epoch',
		props.created,
		'id',
		props.id,
	);
}
