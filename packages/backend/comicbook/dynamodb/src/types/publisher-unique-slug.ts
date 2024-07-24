import { tableItem, tableItemKey } from '@cbx-weekly/backend-core-dynamodb';

import * as vx from '@cbx-weekly/backend-comicbook-valibot';
import * as v from 'valibot';

export function parsePublisherUniqueSlugTableItem(input: unknown) {
	return v.parse(publisherUniqueSlugTableItemSchema, input, {
		abortEarly: true,
		abortPipeEarly: true,
	});
}

const publisherUniqueSlugTableItemSchema = tableItem(
	v.strictObject({
		Pk: tableItemKey(
			v.strictTuple([
				v.literal('publishers'),
				v.literal('unq'),
				v.literal('slug'),
				v.pipe(v.string(), vx.slug()),
			]),
		),
		Sk: tableItemKey(v.strictTuple([])),
		Id: v.pipe(v.string(), vx.ulid()),
		Slug: v.pipe(v.string(), vx.slug()),
	}),
);

export type RawPublisherUniqueSlugTableItem = v.InferInput<
	typeof publisherUniqueSlugTableItemSchema
>;
export type PublisherUniqueSlugTableItem = v.InferOutput<
	typeof publisherUniqueSlugTableItemSchema
>;
