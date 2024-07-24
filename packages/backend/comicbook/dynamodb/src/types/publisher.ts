import * as v from '@cbx-weekly/backend-core-valibot';
import * as vx from '../valibot';

import { deepCamelKeys } from 'string-ts';

export const rawPublisherTableItemSchema = v.object({
	Pk: v.pipe(v.string(), vx.capturePublisherPartitionKey()),
	Sk: v.pipe(v.string(), vx.capturePublisherSortKey()),
	Gsi1Pk: v.pipe(v.string(), vx.capturePublisherGsi1PartitionKey()),
	Gsi1Sk: v.pipe(v.string(), vx.capturePublisherGsi1SortKey()),
	Gsi2Pk: v.pipe(v.string(), vx.capturePublisherGsi2PartitionKey()),
	Gsi2Sk: v.pipe(v.string(), vx.capturePublisherGsi2SortKey()),
	Id: v.pipe(v.string(), v.id()),
	Title: v.strictObject({
		Name: v.pipe(v.string(), vx.publisherName()),
	}),
	Slug: v.pipe(v.string(), v.slug()),
	LatestUpdate: v.optional(
		v.strictObject({
			Id: v.pipe(v.string(), v.id()),
			Kind: v.never(),
		}),
	),
});

export const publisherTableItemSchema = v.pipe(
	v.omit(rawPublisherTableItemSchema, [
		'Pk',
		'Sk',
		'Gsi1Pk',
		'Gsi1Sk',
		'Gsi2Pk',
		'Gsi2Sk',
	]),
	v.transform(deepCamelKeys),
);

export const rawPublisherUniqueSlugTableItemSchema = v.object({
	Pk: v.pipe(v.string(), vx.capturePublisherUniqueSlugPartitionKey()),
	Sk: v.pipe(v.string(), vx.capturePublisherUniqueSlugSortKey()),
	Id: v.pipe(v.string(), v.id()),
	Slug: v.pipe(v.string(), v.slug()),
});

export const publisherUniqueSlugTableItemSchema = v.pipe(
	v.omit(rawPublisherUniqueSlugTableItemSchema, ['Pk', 'Sk']),
	v.transform(deepCamelKeys),
);

export const publisherTableItemGsi2PaginationKeysSchema = v.pipe(
	v.pick(rawPublisherTableItemSchema, ['Pk', 'Gsi2Sk']),
	v.transform((value) => ({
		id: value.Pk.id,
		slug: value.Gsi2Sk.slug,
	})),
);

export const publisherTableItemGsi2PaginationCursorSchema = v.pipe(
	v.string(),
	vx.capturePublisherGsi2PaginationCursor(),
);

export declare namespace Publisher {
	type TableItem = v.InferOutput<typeof publisherTableItemSchema>;

	namespace TableItem {
		type Raw = v.InferInput<typeof rawPublisherTableItemSchema>;
	}

	namespace Unique {
		namespace Slug {
			type TableItem = v.InferOutput<typeof publisherUniqueSlugTableItemSchema>;
			namespace TableItem {
				type Raw = v.InferInput<typeof rawPublisherUniqueSlugTableItemSchema>;
			}
		}
	}
}
