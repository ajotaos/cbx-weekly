import { tableItem, tableItemKey } from '@cbx-weekly/backend-core-dynamodb';

import * as vx from '@cbx-weekly/backend-comicbook-valibot';
import * as v from 'valibot';

export function parseSeriesTableItem(input: unknown) {
	return v.parse(seriesTableItemSchema, input, {
		abortEarly: true,
		abortPipeEarly: true,
	});
}

const seriesTableItemSchema = tableItem(
	v.strictObject({
		Pk: tableItemKey(
			v.strictTuple([
				v.literal('series'),
				v.literal('id'),
				v.pipe(v.string(), vx.ulid()),
			]),
		),
		Sk: tableItemKey(v.strictTuple([])),
		Gsi1Pk: tableItemKey(
			v.strictTuple([
				v.literal('series'),
				v.literal('slug'),
				v.pipe(v.string(), vx.slug()),
			]),
		),
		Gsi1Sk: tableItemKey(v.strictTuple([])),
		Gsi2Pk: tableItemKey(
			v.strictTuple([
				v.literal('series'),
				v.literal('publisher-id'),
				v.pipe(v.string(), vx.ulid()),
			]),
		),
		Gsi2Sk: tableItemKey(
			v.strictTuple([v.literal('slug'), v.pipe(v.string(), vx.slug())]),
		),
		Gsi3Pk: tableItemKey(
			v.strictTuple([
				v.literal('series'),
				v.literal('release-date'),
				v.pipe(v.string(), v.isoDate()),
			]),
		),
		Gsi3Sk: tableItemKey(
			v.strictTuple([v.literal('slug'), v.pipe(v.string(), vx.slug())]),
		),
		Id: v.pipe(v.string(), vx.ulid()),
		Title: v.strictObject({
			Publisher: v.pipe(v.string(), vx.publisherName()),
			Name: v.pipe(v.string(), vx.seriesName()),
		}),
		Slug: v.pipe(v.string(), vx.slug()),
		PublisherId: v.pipe(v.string(), vx.ulid()),
		ReleaseDate: v.pipe(v.string(), v.isoDate()),
	}),
);

export type RawSeriesTableItem = v.InferInput<typeof seriesTableItemSchema>;
export type SeriesTableItem = v.InferOutput<typeof seriesTableItemSchema>;
