import { Dynamodb } from '@cbx-weekly/utils/dynamodb';

import type * as v_comicbook from '@cbx-weekly/valibot/comicbook';

export function makeIssueUniquePagesetIdPk(
	props: v_comicbook.IssueUniquePagesetIdPkComponents,
) {
	return Dynamodb.Keys.makePartitionKey(
		'issue',
		'unq',
		'pageset-id',
		props.pagesetId,
	);
}

export function makeIssueUniquePagesetIdSk() {
	return Dynamodb.Keys.makeSortKey();
}
