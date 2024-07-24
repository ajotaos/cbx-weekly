import {
	makeTableItemPartitionKey,
	makeTableItemSortKey,
} from '@cbx-weekly/backend-core-dynamodb';

import type { SeriesUniqueSlugTableItem } from '../types';

export const seriesUniqueSlugTableItemKeys = {
	makePk(props: Pick<SeriesUniqueSlugTableItem, 'slug'>) {
		return makeTableItemPartitionKey('series', 'unq', 'slug', props.slug);
	},
	makeSk() {
		return makeTableItemSortKey();
	},
};
