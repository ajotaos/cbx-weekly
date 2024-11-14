import { Dynamodb } from '@cbx-weekly/utils/dynamodb';

import type * as v_comicbook from '@cbx-weekly/valibot/comicbook';

export function makePublisherUniqueSlugPk(
	props: v_comicbook.PublisherUniqueSlugPkComponents,
) {
	return Dynamodb.Keys.makePartitionKey('publisher', 'unq', 'slug', props.slug);
}

export function makePublisherUniqueSlugSk() {
	return Dynamodb.Keys.makeSortKey();
}
