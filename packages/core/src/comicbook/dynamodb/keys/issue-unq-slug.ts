import { Dynamodb } from '@cbx-weekly/utils/dynamodb';

import type * as v_comicbook from '@cbx-weekly/valibot/comicbook';

export function makeIssueUniqueSlugPk(
	props: v_comicbook.IssueUniqueSlugPkComponents,
) {
	return Dynamodb.Keys.makePartitionKey('issue', 'unq', 'slug', props.slug);
}

export function makeIssueUniqueSlugSk() {
	return Dynamodb.Keys.makeSortKey();
}
