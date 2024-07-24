import { encodeBucketObjectKey } from '@cbx-weekly/backend-core-s3';

import type { IssuePagesArchive } from '../types';

export function encodeIssuePagesArchiveBucketObjectKey(
	props: Pick<IssuePagesArchive.BucketObject.Metadata, 'id' | 'issueId'>,
) {
	return encodeBucketObjectKey(
		'issues',
		props.issueId,
		'pages',
		'archives',
		`${props.id}.cbz`,
	);
}
