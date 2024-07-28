import {
	SERIES_TABLE_ITEM_GSI2_PAGINATION_CURSOR_REGEX,
	SERIES_TABLE_ITEM_GSI2_PARTITION_KEY_REGEX,
	SERIES_TABLE_ITEM_GSI2_SORT_KEY_REGEX,
	SERIES_TABLE_ITEM_PARTITION_KEY_REGEX,
} from '../regex';

import { tableItem } from '@cbx-weekly/backend-core-dynamodb';

import * as vxx from '@cbx-weekly/backend-comicbook-valibot';
import * as vx from '@cbx-weekly/shared-valibot';
import * as v from 'valibot';

export const seriesTableItemSchema = tableItem(
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
			Name: v.pipe(v.string(), vxx.seriesName()),
		}),
		Slug: v.pipe(v.string(), vx.slug()),
		ReleaseDate: v.pipe(v.string(), v.isoDate()),
		PublisherId: v.pipe(v.string(), vx.ulid()),
	}),
);

export const seriesUniqueSlugTableItemSchema = tableItem(
	v.strictObject({
		Pk: v.string(),
		Sk: v.string(),
		Id: v.pipe(v.string(), vx.ulid()),
		Slug: v.pipe(v.string(), vx.slug()),
	}),
);

export const seriesTableItemGsi2PaginationKeySchema = v.pipe(
	v.object({
		Pk: v.pipe(
			v.string(),
			vx.captureNamedGroups(SERIES_TABLE_ITEM_PARTITION_KEY_REGEX),
			v.strictObject({ id: v.pipe(v.string(), vx.ulid()) }),
		),
		Gsi2Pk: v.pipe(
			v.string(),
			vx.captureNamedGroups(SERIES_TABLE_ITEM_GSI2_PARTITION_KEY_REGEX),
			v.strictObject({ publisherId: v.pipe(v.string(), vx.ulid()) }),
		),
		Gsi2Sk: v.pipe(
			v.string(),
			vx.captureNamedGroups(SERIES_TABLE_ITEM_GSI2_SORT_KEY_REGEX),
			v.strictObject({ slug: v.pipe(v.string(), vx.slug()) }),
		),
	}),
	v.transform((value) => ({
		id: value.Pk.id,
		slug: value.Gsi2Sk.slug,
		publisherId: value.Gsi2Pk.publisherId,
	})),
);

export const seriesTableItemGsi2PaginationCursorSchema = v.pipe(
	v.string(),
	vx.captureNamedGroups(SERIES_TABLE_ITEM_GSI2_PAGINATION_CURSOR_REGEX),
	v.strictObject({
		id: v.pipe(v.string(), vx.ulid()),
		slug: v.pipe(v.string(), vx.slug()),
		publisherId: v.pipe(v.string(), vx.ulid()),
	}),
);

export type SeriesTableItem = v.InferOutput<typeof seriesTableItemSchema>;

export declare namespace SeriesTableItem {
	type Raw = v.InferInput<typeof seriesTableItemSchema>;

	namespace Unique {
		type SlugTableItem = v.InferOutput<typeof seriesUniqueSlugTableItemSchema>;

		namespace SlugTableItem {
			type Raw = v.InferInput<typeof seriesUniqueSlugTableItemSchema>;
		}
	}
}
