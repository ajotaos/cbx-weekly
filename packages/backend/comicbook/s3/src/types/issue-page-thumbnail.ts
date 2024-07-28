import { bucketObjectMetadata } from '@cbx-weekly/backend-core-s3';

import * as vx from '@cbx-weekly/shared-valibot';
import * as v from 'valibot';

export const issuePageThumbnailBucketObjectMetadataSchema =
	bucketObjectMetadata(
		v.object({
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
			'page-id': v.pipe(v.string(), vx.ulid()),
			'issue-id': v.pipe(v.string(), vx.ulid()),
		}),
	);

export type IssuePageThumbnailBucketObject = {
	body: () => Promise<Uint8Array>;
	metadata: IssuePageThumbnailBucketObject.Metadata;
};

export declare namespace IssuePageThumbnailBucketObject {
	type Metadata = v.InferOutput<
		typeof issuePageThumbnailBucketObjectMetadataSchema
	>;
	namespace Metadata {
		type Raw = v.InferInput<
			typeof issuePageThumbnailBucketObjectMetadataSchema
		>;
	}
}
