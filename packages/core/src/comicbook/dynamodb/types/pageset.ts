import * as v_comicbook from '@cbx-weekly/valibot/comicbook';
import * as v from '@cbx-weekly/valibot/core';

import { deepCamelKeys } from 'string-ts';

export const rawPagesetSchema = v.strictObject({
	Pk: v.pipe(v.string(), v_comicbook.capturePagesetPkComponents()),
	Sk: v.pipe(v.string(), v_comicbook.capturePagesetSkComponents()),
	Gsi1Pk: v.pipe(v.string(), v_comicbook.capturePagesetGsi1PkComponents()),
	Gsi1Sk: v.pipe(v.string(), v_comicbook.capturePagesetGsi1SkComponents()),
	Id: v.pipe(v.string(), v.id()),
	Status: v.picklist(['created', 'pending', 'processing', 'ready', 'failed']),
	IssueId: v.pipe(v.string(), v.id()),
	Expiration: v.optional(v.pipe(v.number(), v.finite())),
	LatestUpdate: v.optional(
		v.strictObject({
			Id: v.pipe(v.string(), v.id()),
			Type: v.picklist(['status']),
		}),
	),
});

export type RawPageset = v.InferInput<typeof rawPagesetSchema>;

export const pagesetSchema = v.pipe(
	v.omit(v.object(rawPagesetSchema.entries), [
		'Pk',
		'Sk',
		'Gsi1Pk',
		'Gsi1Sk',
		'LatestUpdate',
	]),
	v.transform(deepCamelKeys),
);

export type Pageset = v.InferOutput<typeof pagesetSchema>;

export const pagesetGsi1KeysSchema = v.pipe(
	v.pick(v.object(rawPagesetSchema.entries), ['Pk', 'Gsi1Pk', 'Gsi1Sk']),
	v.transform((value) => ({
		id: value.Pk.id,
		created: value.Gsi1Sk.created,
		issueId: value.Gsi1Pk.issueId,
	})),
);

export const pagesetGsi1CursorSchema = v.pipe(
	v.string(),
	v_comicbook.capturePagesetGsi1CursorComponents(),
);
