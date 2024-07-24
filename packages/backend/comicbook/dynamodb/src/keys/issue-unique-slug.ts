import {
	makeTableItemPartitionKey,
	makeTableItemSortKey,
} from '@cbx-weekly/backend-core-dynamodb';

import type { IssueUniqueSlugTableItem } from '../types';

export const issueUniqueSlugTableItemKeys = {
	makePk(props: Pick<IssueUniqueSlugTableItem, 'slug'>) {
		return makeTableItemPartitionKey('issues', 'unq', 'slug', props.slug);
	},
	makeSk() {
		return makeTableItemSortKey();
	},
};
