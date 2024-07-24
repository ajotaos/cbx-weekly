import { encodeBucketObjectKey } from '@cbx-weekly/backend-core-s3';

import type { IssuePagesUpload } from '../types';

export function encodeIssuePagesUploadBucketObjectKey(
	props: Pick<IssuePagesUpload.BucketObject.Metadata, 'id' | 'issueId'>,
) {
	return encodeBucketObjectKey(
		'issues',
		props.issueId,
		'pages',
		'uploads',
		`${props.id}.zip`,
	);
}
