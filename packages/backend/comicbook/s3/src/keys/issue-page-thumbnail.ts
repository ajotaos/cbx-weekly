import { encodeBucketObjectKey } from '@cbx-weekly/backend-core-s3';

import type { IssuePageThumbnailBucketObject } from '../types';

export function encodeIssuePageThumbnailBucketObjectKey(
	props: Pick<IssuePageThumbnailBucketObject.Metadata, 'pageId' | 'issueId'>,
) {
	return encodeBucketObjectKey(
		'issues',
		props.issueId,
		'pages',
		`${props.pageId}.thumbnail.jpg`,
	);
}
