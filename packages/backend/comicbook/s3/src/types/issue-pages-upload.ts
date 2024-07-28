import { bucketObjectMetadata } from '@cbx-weekly/backend-core-s3';

import * as vx from '@cbx-weekly/shared-valibot';
import * as v from 'valibot';

export const issuePagesUploadBucketObjectMetadataSchema = bucketObjectMetadata(
	v.object({
		id: v.pipe(v.string(), vx.ulid()),
		'issue-id': v.pipe(v.string(), vx.ulid()),
	}),
);

export type IssuePagesUploadBucketObject = {
	body: () => Promise<Uint8Array>;
	metadata: IssuePagesUploadBucketObject.Metadata;
};

export declare namespace IssuePagesUploadBucketObject {
	type Metadata = v.InferOutput<
		typeof issuePagesUploadBucketObjectMetadataSchema
	>;
	namespace Metadata {
		type Raw = v.InferInput<typeof issuePagesUploadBucketObjectMetadataSchema>;
	}
}
