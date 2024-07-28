import {
	PUBLISHER_TABLE_ITEM_GSI2_PAGINATION_CURSOR_REGEX,
	PUBLISHER_TABLE_ITEM_GSI2_SORT_KEY_REGEX,
	PUBLISHER_TABLE_ITEM_PARTITION_KEY_REGEX,
} from '../regex';

import { tableItem } from '@cbx-weekly/backend-core-dynamodb';

import * as vxx from '@cbx-weekly/backend-comicbook-valibot';
import * as vx from '@cbx-weekly/shared-valibot';
import * as v from 'valibot';

export const publisherTableItemSchema = tableItem(
	v.strictObject({
		Pk: v.string(),
		Sk: v.string(),
		Gsi1Pk: v.string(),
		Gsi1Sk: v.string(),
		Gsi2Pk: v.string(),
		Gsi2Sk: v.string(),
		Id: v.pipe(v.string(), vx.ulid()),
		Title: v.strictObject({
			Name: v.pipe(v.string(), vxx.publisherName()),
		}),
		Slug: v.pipe(v.string(), vx.slug()),
	}),
);

export const publisherUniqueSlugTableItemSchema = tableItem(
	v.strictObject({
		Pk: v.string(),
		Sk: v.string(),
		Id: v.pipe(v.string(), vx.ulid()),
		Slug: v.pipe(v.string(), vx.slug()),
	}),
);

export const publisherTableItemGsi2PaginationKeySchema = v.pipe(
	v.object({
		Pk: v.pipe(
			v.string(),
			vx.captureNamedGroups(PUBLISHER_TABLE_ITEM_PARTITION_KEY_REGEX),
			v.strictObject({ id: v.pipe(v.string(), vx.ulid()) }),
		),
		Gsi2Sk: v.pipe(
			v.string(),
			vx.captureNamedGroups(PUBLISHER_TABLE_ITEM_GSI2_SORT_KEY_REGEX),
			v.strictObject({ slug: v.pipe(v.string(), vx.slug()) }),
		),
	}),
	v.transform((value) => ({
		id: value.Pk.id,
		slug: value.Gsi2Sk.slug,
	})),
);

export const publisherTableItemGsi2PaginationCursorSchema = v.pipe(
	v.string(),
	vx.captureNamedGroups(PUBLISHER_TABLE_ITEM_GSI2_PAGINATION_CURSOR_REGEX),
	v.strictObject({
		id: v.pipe(v.string(), vx.ulid()),
		slug: v.pipe(v.string(), vx.slug()),
	}),
);

export type PublisherTableItem = v.InferOutput<typeof publisherTableItemSchema>;

export declare namespace PublisherTableItem {
	type Raw = v.InferInput<typeof publisherTableItemSchema>;

	namespace Unique {
		type SlugTableItem = v.InferOutput<
			typeof publisherUniqueSlugTableItemSchema
		>;

		namespace SlugTableItem {
			type Raw = v.InferInput<typeof publisherUniqueSlugTableItemSchema>;
		}
	}
}
