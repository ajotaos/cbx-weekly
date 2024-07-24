import * as v from '@cbx-weekly/backend-core-valibot';

import { deepCamelKeys } from 'string-ts';

export const rawIssuePageThumbnailBucketObjectMetadataSchema = v.object({
	'page-id': v.pipe(v.string(), v.id()),
	dimensions: v.pipe(
		v.string(),
		v.transform((value) => value.split('x')),
		v.length(2),
		v.transform((value) => ({ width: value[0], height: value[1] })),
		v.strictObject(
			v.entriesFromList(
				['width', 'height'],
				v.pipe(
					v.string(),
					v.digits(),
					v.transform((value) => Number(value)),
					v.integer(),
					v.minValue(1),
				),
			),
		),
	),
	'issue-id': v.pipe(v.string(), v.id()),
});

export const issuePageThumbnailBucketObjectMetadataSchema = v.pipe(
	rawIssuePageThumbnailBucketObjectMetadataSchema,
	v.transform(deepCamelKeys),
);

export declare namespace IssuePageThumbnail {
	type BucketObject = {
		body: () => Promise<Uint8Array>;
		metadata: BucketObject.Metadata;
	};

	namespace BucketObject {
		type Metadata = v.InferOutput<
			typeof issuePageThumbnailBucketObjectMetadataSchema
		>;
		namespace Metadata {
			type Raw = v.InferInput<
				typeof rawIssuePageThumbnailBucketObjectMetadataSchema
			>;
		}
	}
}
