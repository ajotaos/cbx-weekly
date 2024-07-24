import * as v from '@cbx-weekly/backend-core-valibot';

import { deepCamelKeys } from 'string-ts';

export const rawIssuePagesArchiveBucketObjectMetadataSchema = v.object({
	id: v.pipe(v.string(), v.id()),
	'issue-id': v.pipe(v.string(), v.id()),
});

export const issuePagesArchiveBucketObjectMetadataSchema = v.pipe(
	rawIssuePagesArchiveBucketObjectMetadataSchema,
	v.transform(deepCamelKeys),
);

export declare namespace IssuePagesArchive {
	type BucketObject = {
		body: () => Promise<Uint8Array>;
		metadata: BucketObject.Metadata;
	};

	namespace BucketObject {
		type Metadata = v.InferOutput<
			typeof issuePagesArchiveBucketObjectMetadataSchema
		>;
		namespace Metadata {
			type Raw = v.InferInput<
				typeof rawIssuePagesArchiveBucketObjectMetadataSchema
			>;
		}
	}
}
