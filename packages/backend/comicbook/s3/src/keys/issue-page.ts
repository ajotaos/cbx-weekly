import { encodeBucketObjectKey } from '@cbx-weekly/backend-core-s3';

import type { IssuePage } from '../types';

export function encodeIssuePageBucketObjectKey(
	props: Pick<IssuePage.BucketObject.Metadata, 'id' | 'issueId'>,
) {
	return encodeBucketObjectKey(
		'issues',
		props.issueId,
		'pages',
		`${props.id}.raw.jpg`,
	);
}
