import * as v_comicbook from '@cbx-weekly/valibot/comicbook';
import * as v from '@cbx-weekly/valibot/core';

import { deepCamelKeys } from 'string-ts';

export const rawPublisherUniqueSlugSchema = v.strictObject({
	Pk: v.pipe(v.string(), v_comicbook.capturePublisherUniqueSlugPkComponents()),
	Sk: v.pipe(v.string(), v_comicbook.capturePublisherUniqueSlugSkComponents()),
	Slug: v.pipe(v.string(), v.slug()),
	PublisherId: v.pipe(v.string(), v.id()),
});

export type RawPublisherUniqueSlug = v.InferInput<
	typeof rawPublisherUniqueSlugSchema
>;

export const publisherUniqueSlugSchema = v.pipe(
	v.omit(v.object(rawPublisherUniqueSlugSchema.entries), ['Pk', 'Sk']),
	v.transform(deepCamelKeys),
);

export type PublisherUniqueSlug = v.InferOutput<
	typeof publisherUniqueSlugSchema
>;
