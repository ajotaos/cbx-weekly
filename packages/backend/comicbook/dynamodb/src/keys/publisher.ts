import {
	makeTableItemPartitionKey,
	makeTableItemSortKey,
} from '@cbx-weekly/backend-core-dynamodb';

import type { PublisherTableItem } from '../types';

export const publisherTableItemKeys = {
	makePk(props: Pick<PublisherTableItem, 'id'>) {
		return makeTableItemPartitionKey('publishers', 'id', props.id);
	},
	makeSk() {
		return makeTableItemSortKey();
	},
	makeGsi1Pk(props: Pick<PublisherTableItem, 'slug'>) {
		return makeTableItemPartitionKey('publishers', 'slug', props.slug);
	},
	makeGsi1Sk() {
		return makeTableItemSortKey();
	},
	makeGsi2Pk() {
		return makeTableItemPartitionKey('publishers');
	},
	makeGsi2Sk(props: Pick<PublisherTableItem, 'slug'>) {
		return makeTableItemSortKey('slug', props.slug);
	},
};
