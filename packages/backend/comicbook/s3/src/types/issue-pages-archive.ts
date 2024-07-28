import { bucketObjectMetadata } from '@cbx-weekly/backend-core-s3';

import * as vx from '@cbx-weekly/shared-valibot';
import * as v from 'valibot';

export const issuePagesArchiveBucketObjectMetadataSchema = bucketObjectMetadata(
	v.object({
		id: v.pipe(v.string(), vx.ulid()),
		'issue-id': v.pipe(v.string(), vx.ulid()),
	}),
);

export type IssuePagesArchiveBucketObject = {
	body: () => Promise<Uint8Array>;
	metadata: IssuePagesArchiveBucketObject.Metadata;
};

export declare namespace IssuePagesArchiveBucketObject {
	type Metadata = v.InferOutput<
		typeof issuePagesArchiveBucketObjectMetadataSchema
	>;
	namespace Metadata {
		type Raw = v.InferInput<typeof issuePagesArchiveBucketObjectMetadataSchema>;
	}
}
