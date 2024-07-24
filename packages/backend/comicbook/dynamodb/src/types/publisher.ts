import { tableItem, tableItemKey } from '@cbx-weekly/backend-core-dynamodb';

import * as vx from '@cbx-weekly/backend-comicbook-valibot';
import * as v from 'valibot';

export function parsePublisherTableItem(input: unknown) {
	return v.parse(publisherTableItemSchema, input, {
		abortEarly: true,
		abortPipeEarly: true,
	});
}

const publisherTableItemSchema = tableItem(
	v.strictObject({
		Pk: tableItemKey(
			v.strictTuple([
				v.literal('publishers'),
				v.literal('id'),
				v.pipe(v.string(), vx.ulid()),
			]),
		),
		Sk: tableItemKey(v.strictTuple([])),
		Gsi1Pk: tableItemKey(
			v.strictTuple([
				v.literal('publishers'),
				v.literal('slug'),
				v.pipe(v.string(), vx.slug()),
			]),
		),
		Gsi1Sk: tableItemKey(v.strictTuple([])),
		Gsi2Pk: tableItemKey(v.strictTuple([v.literal('publishers')])),
		Gsi2Sk: tableItemKey(
			v.strictTuple([v.literal('slug'), v.pipe(v.string(), vx.slug())]),
		),
		Id: v.pipe(v.string(), vx.ulid()),
		Title: v.strictObject({
			Name: v.pipe(v.string(), vx.publisherName()),
		}),
		Slug: v.pipe(v.string(), vx.slug()),
	}),
);

export type RawPublisherTableItem = v.InferInput<
	typeof publisherTableItemSchema
>;
export type PublisherTableItem = v.InferOutput<typeof publisherTableItemSchema>;
