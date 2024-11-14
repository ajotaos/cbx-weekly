import * as v_comicbook from '@cbx-weekly/valibot/comicbook';
import * as v from '@cbx-weekly/valibot/core';

import { deepCamelKeys } from 'string-ts';

export const rawSeriesSchema = v.strictObject({
	Pk: v.pipe(v.string(), v_comicbook.captureSeriesPkComponents()),
	Sk: v.pipe(v.string(), v_comicbook.captureSeriesSkComponents()),
	Gsi1Pk: v.pipe(v.string(), v_comicbook.captureSeriesGsi1PkComponents()),
	Gsi1Sk: v.pipe(v.string(), v_comicbook.captureSeriesGsi1SkComponents()),
	Gsi2Pk: v.pipe(v.string(), v_comicbook.captureSeriesGsi2PkComponents()),
	Gsi2Sk: v.pipe(v.string(), v_comicbook.captureSeriesGsi2SkComponents()),
	Gsi3Pk: v.pipe(v.string(), v_comicbook.captureSeriesGsi3PkComponents()),
	Gsi3Sk: v.pipe(v.string(), v_comicbook.captureSeriesGsi3SkComponents()),
	Id: v.pipe(v.string(), v.id()),
	Slug: v.pipe(v.string(), v.slug()),
	Title: v.strictObject({
		Publisher: v.pipe(v.string(), v_comicbook.publisherName()),
		Name: v.pipe(v.string(), v_comicbook.seriesName()),
	}),
	ReleaseDate: v.pipe(v.string(), v.isoWeekDate()),
	PublisherId: v.pipe(v.string(), v.id()),
	LatestUpdate: v.optional(
		v.strictObject({
			Id: v.pipe(v.string(), v.id()),
			Type: v.never(),
		}),
	),
});

export type RawSeries = v.InferInput<typeof rawSeriesSchema>;

export const seriesSchema = v.pipe(
	v.omit(v.object(rawSeriesSchema.entries), [
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

export type Series = v.InferOutput<typeof seriesSchema>;

export const seriesGsi2KeysSchema = v.pipe(
	v.pick(v.object(rawSeriesSchema.entries), ['Pk', 'Gsi2Pk', 'Gsi2Sk']),
	v.transform((value) => ({
		id: value.Pk.id,
		slug: value.Gsi2Sk.slug,
		publisherId: value.Gsi2Pk.publisherId,
	})),
);

export const seriesGsi2CursorSchema = v.pipe(
	v.string(),
	v_comicbook.captureSeriesGsi2CursorComponents(),
);

export const seriesGsi3KeysSchema = v.pipe(
	v.pick(v.object(rawSeriesSchema.entries), ['Pk', 'Gsi3Pk', 'Gsi3Sk']),
	v.transform((value) => ({
		id: value.Pk.id,
		slug: value.Gsi3Sk.slug,
		releaseDate: `${value.Gsi3Pk.releaseWeek}-${value.Gsi3Sk.releaseWeekday}`,
	})),
);

export const seriesGsi3CursorSchema = v.pipe(
	v.string(),
	v_comicbook.captureSeriesGsi3CursorComponents(),
);
