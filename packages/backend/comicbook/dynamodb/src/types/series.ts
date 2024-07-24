import * as v from '@cbx-weekly/backend-core-valibot';
import * as vx from '../valibot';

import { deepCamelKeys } from 'string-ts';

export const rawSeriesTableItemSchema = v.object({
	Pk: v.pipe(v.string(), vx.captureSeriesPartitionKey()),
	Sk: v.pipe(v.string(), vx.captureSeriesSortKey()),
	Gsi1Pk: v.pipe(v.string(), vx.captureSeriesGsi1PartitionKey()),
	Gsi1Sk: v.pipe(v.string(), vx.captureSeriesGsi1SortKey()),
	Gsi2Pk: v.pipe(v.string(), vx.captureSeriesGsi2PartitionKey()),
	Gsi2Sk: v.pipe(v.string(), vx.captureSeriesGsi2SortKey()),
	Gsi3Pk: v.pipe(v.string(), vx.captureSeriesGsi3PartitionKey()),
	Gsi3Sk: v.pipe(v.string(), vx.captureSeriesGsi3SortKey()),
	Id: v.pipe(v.string(), v.id()),
	Title: v.strictObject({
		Publisher: v.pipe(v.string(), vx.publisherName()),
		Name: v.pipe(v.string(), vx.seriesName()),
	}),
	Slug: v.pipe(v.string(), v.slug()),
	ReleaseDate: v.pipe(v.string(), v.isoDate()),
	PublisherId: v.pipe(v.string(), v.id()),
	LatestUpdate: v.optional(
		v.strictObject({
			Id: v.pipe(v.string(), v.id()),
			Kind: v.never(),
		}),
	),
});

export const seriesTableItemSchema = v.pipe(
	v.omit(rawSeriesTableItemSchema, [
		'Pk',
		'Sk',
		'Gsi1Pk',
		'Gsi1Sk',
		'Gsi2Pk',
		'Gsi2Sk',
		'Gsi3Pk',
		'Gsi3Sk',
	]),
	v.transform(deepCamelKeys),
);

export const rawSeriesUniqueSlugTableItemSchema = v.object({
	Pk: v.pipe(v.string(), vx.captureSeriesUniqueSlugPartitionKey()),
	Sk: v.pipe(v.string(), vx.captureSeriesUniqueSlugSortKey()),
	Id: v.pipe(v.string(), v.id()),
	Slug: v.pipe(v.string(), v.slug()),
});

export const seriesUniqueSlugTableItemSchema = v.pipe(
	v.omit(rawSeriesUniqueSlugTableItemSchema, ['Pk', 'Sk']),
	v.transform(deepCamelKeys),
);

export const seriesTableItemGsi2PaginationKeysSchema = v.pipe(
	v.pick(rawSeriesTableItemSchema, ['Pk', 'Gsi2Pk', 'Gsi2Sk']),
	v.transform((value) => ({
		id: value.Pk.id,
		slug: value.Gsi2Sk.slug,
		publisherId: value.Gsi2Pk.publisherId,
	})),
);

export const seriesTableItemGsi2PaginationCursorSchema = v.pipe(
	v.string(),
	vx.captureSeriesGsi2PaginationCursor(),
);

export declare namespace Series {
	type TableItem = v.InferOutput<typeof seriesTableItemSchema>;

	namespace TableItem {
		type Raw = v.InferInput<typeof rawSeriesTableItemSchema>;
	}

	namespace Unique {
		namespace Slug {
			type TableItem = v.InferOutput<typeof seriesUniqueSlugTableItemSchema>;
			namespace TableItem {
				type Raw = v.InferInput<typeof rawSeriesUniqueSlugTableItemSchema>;
			}
		}
	}
}
