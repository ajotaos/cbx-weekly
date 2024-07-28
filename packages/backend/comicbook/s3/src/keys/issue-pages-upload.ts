import { encodeBucketObjectKey } from '@cbx-weekly/backend-core-s3';

import type { IssuePagesUploadBucketObject } from '../types';

export function encodeIssuePagesUploadBucketObjectKey(
	props: Pick<IssuePagesUploadBucketObject.Metadata, 'id' | 'issueId'>,
) {
	return encodeBucketObjectKey(
		'issues',
		props.issueId,
		'pages',
		'uploads',
		`${props.id}.zip`,
	);
}
