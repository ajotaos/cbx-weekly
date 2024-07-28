import {
	ISSUE_TABLE_ITEM_GSI2_PAGINATION_CURSOR_REGEX,
	ISSUE_TABLE_ITEM_GSI2_PARTITION_KEY_REGEX,
	ISSUE_TABLE_ITEM_GSI2_SORT_KEY_REGEX,
	ISSUE_TABLE_ITEM_PARTITION_KEY_REGEX,
} from '../regex';

import { tableItem } from '@cbx-weekly/backend-core-dynamodb';

import * as vxx from '@cbx-weekly/backend-comicbook-valibot';
import * as vx from '@cbx-weekly/shared-valibot';
import * as v from 'valibot';

export const issueTableItemSchema = tableItem(
	v.strictObject({
		Pk: v.string(),
		Sk: v.string(),
		Gsi1Pk: v.string(),
		Gsi1Sk: v.string(),
		Gsi2Pk: v.string(),
		Gsi2Sk: v.string(),
		Gsi3Pk: v.string(),
		Gsi3Sk: v.string(),
		Id: v.pipe(v.string(), vx.ulid()),
		Title: v.strictObject({
			Publisher: v.pipe(v.string(), vxx.publisherName()),
			Series: v.pipe(v.string(), vxx.seriesName()),
			Number: v.pipe(v.string(), vxx.issueNumber()),
		}),
		Slug: v.pipe(v.string(), vx.slug()),
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
		SeriesId: v.pipe(v.string(), vx.ulid()),
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

export const issueUniqueSlugTableItemSchema = tableItem(
	v.strictObject({
		Pk: v.string(),
		Sk: v.string(),
		Id: v.pipe(v.string(), vx.ulid()),
		Slug: v.pipe(v.string(), vx.slug()),
	}),
);

export const issueTableItemGsi2PaginationKeysSchema = v.pipe(
	v.object({
		Pk: v.pipe(
			v.string(),
			vx.captureNamedGroups(ISSUE_TABLE_ITEM_PARTITION_KEY_REGEX),
			v.strictObject({ id: v.pipe(v.string(), vx.ulid()) }),
		),
		Gsi2Pk: v.pipe(
			v.string(),
			vx.captureNamedGroups(ISSUE_TABLE_ITEM_GSI2_PARTITION_KEY_REGEX),
			v.strictObject({ seriesId: v.pipe(v.string(), vx.ulid()) }),
		),
		Gsi2Sk: v.pipe(
			v.string(),
			vx.captureNamedGroups(ISSUE_TABLE_ITEM_GSI2_SORT_KEY_REGEX),
			v.strictObject({ slug: v.pipe(v.string(), vx.slug()) }),
		),
	}),
	v.transform((value) => ({
		id: value.Pk.id,
		slug: value.Gsi2Sk.slug,
		seriesId: value.Gsi2Pk.seriesId,
	})),
);

export const issueTableItemGsi2PaginationCursorSchema = v.pipe(
	v.string(),
	vx.captureNamedGroups(ISSUE_TABLE_ITEM_GSI2_PAGINATION_CURSOR_REGEX),
	v.strictObject({
		id: v.pipe(v.string(), vx.ulid()),
		slug: v.pipe(v.string(), vx.slug()),
		seriesId: v.pipe(v.string(), vx.ulid()),
	}),
);

export type IssueTableItem = v.InferOutput<typeof issueTableItemSchema>;

export declare namespace IssueTableItem {
	type Raw = v.InferInput<typeof issueTableItemSchema>;

	namespace Unique {
		type SlugTableItem = v.InferOutput<typeof issueUniqueSlugTableItemSchema>;

		namespace SlugTableItem {
			type Raw = v.InferInput<typeof issueUniqueSlugTableItemSchema>;
		}
	}
}
