import { tableItem, tableItemKey } from '@cbx-weekly/backend-core-dynamodb';

import * as vx from '@cbx-weekly/backend-comicbook-valibot';
import * as v from 'valibot';

export function parseSeriesUniqueSlugTableItem(input: unknown) {
	return v.parse(seriesUniqueSlugTableItemSchema, input, {
		abortEarly: true,
		abortPipeEarly: true,
	});
}

const seriesUniqueSlugTableItemSchema = tableItem(
	v.strictObject({
		Pk: tableItemKey(
			v.strictTuple([
				v.literal('series'),
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

export type RawSeriesUniqueSlugTableItem = v.InferInput<
	typeof seriesUniqueSlugTableItemSchema
>;
export type SeriesUniqueSlugTableItem = v.InferOutput<
	typeof seriesUniqueSlugTableItemSchema
>;
