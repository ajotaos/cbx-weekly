import {
	makeTableItemPartitionKey,
	makeTableItemSortKey,
} from '@cbx-weekly/backend-core-dynamodb';

import type { PublisherUniqueSlugTableItem } from '../types';

export const publisherUniqueSlugTableItemKeys = {
	makePk(props: Pick<PublisherUniqueSlugTableItem, 'slug'>) {
		return makeTableItemPartitionKey('publishers', 'unq', 'slug', props.slug);
	},
	makeSk() {
		return makeTableItemSortKey();
	},
};
