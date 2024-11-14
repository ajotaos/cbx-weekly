import * as v_comicbook from '@cbx-weekly/valibot/comicbook';
import * as v from '@cbx-weekly/valibot/core';

import { deepCamelKeys } from 'string-ts';

export const rawPublisherSchema = v.strictObject({
	Pk: v.pipe(v.string(), v_comicbook.capturePublisherPkComponents()),
	Sk: v.pipe(v.string(), v_comicbook.capturePublisherSkComponents()),
	Gsi1Pk: v.pipe(v.string(), v_comicbook.capturePublisherGsi1PkComponents()),
	Gsi1Sk: v.pipe(v.string(), v_comicbook.capturePublisherGsi1SkComponents()),
	Gsi2Pk: v.pipe(v.string(), v_comicbook.capturePublisherGsi2PkComponents()),
	Gsi2Sk: v.pipe(v.string(), v_comicbook.capturePublisherGsi2SkComponents()),
	Id: v.pipe(v.string(), v.id()),
	Slug: v.pipe(v.string(), v.slug()),
	Title: v.strictObject({
		Name: v.pipe(v.string(), v_comicbook.publisherName()),
	}),
	LatestUpdate: v.optional(
		v.strictObject({
			Id: v.pipe(v.string(), v.id()),
			Type: v.never(),
		}),
	),
});

export type RawPublisher = v.InferInput<typeof rawPublisherSchema>;

export const publisherSchema = v.pipe(
	v.omit(v.object(rawPublisherSchema.entries), [
		'Pk',
		'Sk',
		'Gsi1Pk',
		'Gsi1Sk',
		'Gsi2Pk',
		'Gsi2Sk',
		'LatestUpdate',
	]),
	v.transform(deepCamelKeys),
);

export type Publisher = v.InferOutput<typeof publisherSchema>;

export const publisherGsi2KeysSchema = v.pipe(
	v.pick(v.object(rawPublisherSchema.entries), ['Pk', 'Gsi2Sk']),
	v.transform((value) => ({
		id: value.Pk.id,
		slug: value.Gsi2Sk.slug,
	})),
);

export const publisherGsi2CursorSchema = v.pipe(
	v.string(),
	v_comicbook.capturePublisherGsi2CursorComponents(),
);
