import { encodeBucketObjectKey } from '@cbx-weekly/backend-core-s3';

import type { IssuePageBucketObject } from '../types';

export function encodeIssuePageBucketObjectKey(
	props: Pick<IssuePageBucketObject.Metadata, 'id' | 'issueId'>,
) {
	return encodeBucketObjectKey(
		'issues',
		props.issueId,
		'pages',
		`${props.id}.raw.jpg`,
	);
}
