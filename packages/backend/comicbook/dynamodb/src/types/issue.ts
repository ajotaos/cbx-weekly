import * as v from '@cbx-weekly/backend-core-valibot';
import * as vx from '../valibot';

import { deepCamelKeys } from 'string-ts';

const rawIssueTableItemSchema = v.object({
	Pk: v.pipe(v.string(), vx.captureIssuePartitionKey()),
	Sk: v.pipe(v.string(), vx.captureIssueSortKey()),
	Gsi1Pk: v.pipe(v.string(), vx.captureIssueGsi1PartitionKey()),
	Gsi1Sk: v.pipe(v.string(), vx.captureIssueGsi1SortKey()),
	Gsi2Pk: v.pipe(v.string(), vx.captureIssueGsi2PartitionKey()),
	Gsi2Sk: v.pipe(v.string(), vx.captureIssueGsi2SortKey()),
	Gsi3Pk: v.pipe(v.string(), vx.captureIssueGsi3PartitionKey()),
	Gsi3Sk: v.pipe(v.string(), vx.captureIssueGsi3SortKey()),
	Id: v.pipe(v.string(), v.id()),
	Title: v.strictObject({
		Publisher: v.pipe(v.string(), vx.publisherName()),
		Series: v.pipe(v.string(), vx.seriesName()),
		Number: v.pipe(v.string(), vx.issueNumber()),
	}),
	Slug: v.pipe(v.string(), v.slug()),
	Pages: v.strictObject({
		Archive: v.optional(
			v.strictObject({
				Id: v.pipe(v.string(), v.id()),
				PageIds: v.array(v.pipe(v.string(), v.id())),
			}),
		),
	}),
	ReleaseDate: v.pipe(v.string(), v.isoDate()),
	SeriesId: v.pipe(v.string(), v.id()),
	LatestUpdate: v.optional(
		v.strictObject({
			Id: v.pipe(v.string(), v.id()),
			Kind: v.picklist(['pages_upload', 'pages']),
		}),
	),
});

export const issueTableItemSchema = v.pipe(
	v.omit(rawIssueTableItemSchema, [
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

export const rawIssueUniqueSlugTableItemSchema = v.object({
	Pk: v.pipe(v.string(), vx.captureIssueUniqueSlugPartitionKey()),
	Sk: v.pipe(v.string(), vx.captureIssueUniqueSlugSortKey()),
	Id: v.pipe(v.string(), v.id()),
	Slug: v.pipe(v.string(), v.slug()),
});

export const issueUniqueSlugTableItemSchema = v.pipe(
	v.omit(rawIssueUniqueSlugTableItemSchema, ['Pk', 'Sk']),
	v.transform(deepCamelKeys),
);

export const issueTableItemGsi2PaginationKeysSchema = v.pipe(
	v.pick(rawIssueTableItemSchema, ['Pk', 'Gsi2Pk', 'Gsi2Sk']),
	v.transform((value) => ({
		id: value.Pk.id,
		slug: value.Gsi2Sk.slug,
		seriesId: value.Gsi2Pk.seriesId,
	})),
);

export const issueTableItemGsi2PaginationCursorSchema = v.pipe(
	v.string(),
	vx.captureIssueGsi2PaginationCursor(),
);

export declare namespace Issue {
	type TableItem = v.InferOutput<typeof issueTableItemSchema>;

	namespace TableItem {
		type Raw = v.InferInput<typeof rawIssueTableItemSchema>;
	}

	namespace Unique {
		namespace Slug {
			type TableItem = v.InferOutput<typeof issueUniqueSlugTableItemSchema>;
			namespace TableItem {
				type Raw = v.InferInput<typeof rawIssueUniqueSlugTableItemSchema>;
			}
		}
	}
}
