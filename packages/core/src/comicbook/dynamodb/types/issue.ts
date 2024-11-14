import * as v_comicbook from '@cbx-weekly/valibot/comicbook';
import * as v from '@cbx-weekly/valibot/core';

import { deepCamelKeys } from 'string-ts';

export const rawIssueSchema = v.strictObject({
	Pk: v.pipe(v.string(), v_comicbook.captureIssuePkComponents()),
	Sk: v.pipe(v.string(), v_comicbook.captureIssueSkComponents()),
	Gsi1Pk: v.pipe(v.string(), v_comicbook.captureIssueGsi1PkComponents()),
	Gsi1Sk: v.pipe(v.string(), v_comicbook.captureIssueGsi1SkComponents()),
	Gsi2Pk: v.pipe(v.string(), v_comicbook.captureIssueGsi2PkComponents()),
	Gsi2Sk: v.pipe(v.string(), v_comicbook.captureIssueGsi2SkComponents()),
	Gsi3Pk: v.pipe(v.string(), v_comicbook.captureIssueGsi3PkComponents()),
	Gsi3Sk: v.pipe(v.string(), v_comicbook.captureIssueGsi3SkComponents()),
	Id: v.pipe(v.string(), v.id()),
	Slug: v.pipe(v.string(), v.slug()),
	Title: v.strictObject({
		Publisher: v.pipe(v.string(), v_comicbook.publisherName()),
		Series: v.pipe(v.string(), v_comicbook.seriesName()),
		Number: v.pipe(v.string(), v_comicbook.issueNumber()),
	}),
	ReleaseDate: v.pipe(v.string(), v.isoWeekDate()),
	PagesetId: v.optional(v.pipe(v.string(), v.id())),
	SeriesId: v.pipe(v.string(), v.id()),
	LatestUpdate: v.optional(
		v.strictObject({
			Id: v.pipe(v.string(), v.id()),
			Type: v.picklist(['pageset-id']),
		}),
	),
});

export type RawIssue = v.InferInput<typeof rawIssueSchema>;

export const issueSchema = v.pipe(
	v.omit(v.object(rawIssueSchema.entries), [
		'Pk',
		'Sk',
		'Gsi1Pk',
		'Gsi1Sk',
		'Gsi2Pk',
		'Gsi2Sk',
		'Gsi3Pk',
		'Gsi3Sk',
		'LatestUpdate',
	]),
	v.transform(deepCamelKeys),
);

export type Issue = v.InferOutput<typeof issueSchema>;

export const issueGsi2KeysSchema = v.pipe(
	v.pick(v.object(rawIssueSchema.entries), ['Pk', 'Gsi2Pk', 'Gsi2Sk']),
	v.transform((value) => ({
		id: value.Pk.id,
		slug: value.Gsi2Sk.slug,
		seriesId: value.Gsi2Pk.seriesId,
	})),
);

export const issueGsi2CursorSchema = v.pipe(
	v.string(),
	v_comicbook.captureIssueGsi2CursorComponents(),
);

export const issueGsi3KeysSchema = v.pipe(
	v.pick(v.object(rawIssueSchema.entries), ['Pk', 'Gsi3Pk', 'Gsi3Sk']),
	v.transform((value) => ({
		id: value.Pk.id,
		slug: value.Gsi3Sk.slug,
		releaseDate: `${value.Gsi3Pk.releaseWeek}-${value.Gsi3Sk.releaseWeekday}`,
	})),
);

export const issueGsi3CursorSchema = v.pipe(
	v.string(),
	v_comicbook.captureIssueGsi3CursorComponents(),
);
