import { tableItem, tableItemKey } from '@cbx-weekly/backend-core-dynamodb';

import * as vx from '@cbx-weekly/backend-comicbook-valibot';
import * as v from 'valibot';

export function parseIssueTableItem(input: unknown) {
	return v.parse(issueTableItemSchema, input, {
		abortEarly: true,
		abortPipeEarly: true,
	});
}

const issueTableItemSchema = tableItem(
	v.strictObject({
		Pk: tableItemKey(
			v.strictTuple([
				v.literal('issues'),
				v.literal('id'),
				v.pipe(v.string(), vx.ulid()),
			]),
		),
		Sk: tableItemKey(v.strictTuple([])),
		Gsi1Pk: tableItemKey(
			v.strictTuple([
				v.literal('issues'),
				v.literal('slug'),
				v.pipe(v.string(), vx.slug()),
			]),
		),
		Gsi1Sk: tableItemKey(v.strictTuple([])),
		Gsi2Pk: tableItemKey(
			v.strictTuple([
				v.literal('issues'),
				v.literal('series-id'),
				v.pipe(v.string(), vx.ulid()),
			]),
		),
		Gsi2Sk: tableItemKey(
			v.strictTuple([v.literal('slug'), v.pipe(v.string(), vx.slug())]),
		),
		Gsi3Pk: tableItemKey(
			v.strictTuple([
				v.literal('issues'),
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
			Series: v.pipe(v.string(), vx.seriesName()),
			Number: v.pipe(v.string(), vx.issueNumber()),
		}),
		Slug: v.pipe(v.string(), vx.slug()),
		SeriesId: v.pipe(v.string(), vx.ulid()),
		ReleaseDate: v.pipe(v.string(), v.isoDate()),
		Pages: v.union([
			v.strictObject({
				State: v.literal('pending'),
			}),
			v.strictObject({
				State: v.literal('fulfilled'),
				PageIds: v.array(v.pipe(v.string(), vx.ulid())),
				ArchiveId: v.pipe(v.string(), vx.ulid()),
			}),
		]),
		LatestUpdate: v.optional(
			v.union([
				v.strictObject({
					Id: v.pipe(v.string(), vx.ulid()),
					Kind: v.literal('pages'),
				}),
			]),
		),
	}),
);

export type RawIssueTableItem = v.InferInput<typeof issueTableItemSchema>;
export type IssueTableItem = v.InferOutput<typeof issueTableItemSchema>;
