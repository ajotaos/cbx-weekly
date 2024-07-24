import * as v from '@cbx-weekly/backend-core-valibot';

import { deepCamelKeys } from 'string-ts';

export const rawIssuePagesUploadBucketObjectMetadataSchema = v.object({
	id: v.pipe(v.string(), v.id()),
	'issue-id': v.pipe(v.string(), v.id()),
});

export const issuePagesUploadBucketObjectMetadataSchema = v.pipe(
	rawIssuePagesUploadBucketObjectMetadataSchema,
	v.transform(deepCamelKeys),
);

export declare namespace IssuePagesUpload {
	type BucketObject = {
		body: () => Promise<Uint8Array>;
		metadata: BucketObject.Metadata;
	};

	namespace BucketObject {
		type Metadata = v.InferOutput<
			typeof issuePagesUploadBucketObjectMetadataSchema
		>;
		namespace Metadata {
			type Raw = v.InferInput<
				typeof rawIssuePagesUploadBucketObjectMetadataSchema
			>;
		}
	}
}
