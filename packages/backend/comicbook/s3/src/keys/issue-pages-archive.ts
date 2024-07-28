import { encodeBucketObjectKey } from '@cbx-weekly/backend-core-s3';

import type { IssuePagesArchiveBucketObject } from '../types';

export function encodeIssuePagesArchiveBucketObjectKey(
	props: Pick<IssuePagesArchiveBucketObject.Metadata, 'id' | 'issueId'>,
) {
	return encodeBucketObjectKey(
		'issues',
		props.issueId,
		'pages',
		'archives',
		`${props.id}.cbz`,
	);
}
