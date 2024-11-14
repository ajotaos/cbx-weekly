import { Dynamodb } from '@cbx-weekly/utils/dynamodb';

import type * as v_comicbook from '@cbx-weekly/valibot/comicbook';

export function makeSeriesUniqueSlugPartitionKey(
	props: v_comicbook.SeriesUniqueSlugPkComponents,
) {
	return Dynamodb.Keys.makePartitionKey('series', 'unq', 'slug', props.slug);
}

export function makeSeriesUniqueSlugSortKey() {
	return Dynamodb.Keys.makeSortKey();
}
