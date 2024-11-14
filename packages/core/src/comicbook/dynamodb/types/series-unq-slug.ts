import * as v_comicbook from '@cbx-weekly/valibot/comicbook';
import * as v from '@cbx-weekly/valibot/core';

import { deepCamelKeys } from 'string-ts';

export const rawSeriesUniqueSlugSchema = v.strictObject({
	Pk: v.pipe(v.string(), v_comicbook.captureSeriesUniqueSlugPkComponents()),
	Sk: v.pipe(v.string(), v_comicbook.captureSeriesUniqueSlugSkComponents()),
	Slug: v.pipe(v.string(), v.slug()),
	SeriesId: v.pipe(v.string(), v.id()),
});

export type RawSeriesUniqueSlug = v.InferInput<
	typeof rawSeriesUniqueSlugSchema
>;

export const seriesUniqueSlugSchema = v.pipe(
	v.omit(v.object(rawSeriesUniqueSlugSchema.entries), ['Pk', 'Sk']),
	v.transform(deepCamelKeys),
);

export type SeriesUniqueSlug = v.InferOutput<typeof seriesUniqueSlugSchema>;
