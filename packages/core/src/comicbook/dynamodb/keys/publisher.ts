import { Dynamodb } from '@cbx-weekly/utils/dynamodb';

import type * as v_comicbook from '@cbx-weekly/valibot/comicbook';

export function makePublisherPk(props: v_comicbook.PublisherPkComponents) {
	return Dynamodb.Keys.makePartitionKey('publisher', 'id', props.id);
}

export function makePublisherSk() {
	return Dynamodb.Keys.makeSortKey();
}

export function makePublisherGsi1Pk(
	props: v_comicbook.PublisherGsi1PkComponents,
) {
	return Dynamodb.Keys.makePartitionKey('publisher', 'slug', props.slug);
}

export function makePublisherGsi1Sk() {
	return Dynamodb.Keys.makeSortKey();
}

export function makePublisherGsi2Pk() {
	return Dynamodb.Keys.makePartitionKey('publisher');
}

export function makePublisherGsi2Sk(
	props: v_comicbook.PublisherGsi2SkComponents,
) {
	return Dynamodb.Keys.makeSortKey('slug', props.slug);
}

export function makePublisherGsi2Cursor(
	props: v_comicbook.PublisherGsi2CursorComponents,
) {
	return Dynamodb.Keys.makePartitionKey(
		'publisher',
		'slug',
		props.slug,
		'id',
		props.id,
	);
}
