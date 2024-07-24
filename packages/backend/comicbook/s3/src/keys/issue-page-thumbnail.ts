import { encodeBucketObjectKey } from '@cbx-weekly/backend-core-s3';

import type { IssuePageThumbnail } from '../types';

export function encodeIssuePageThumbnailBucketObjectKey(
	props: Pick<IssuePageThumbnail.BucketObject.Metadata, 'pageId' | 'issueId'>,
) {
	return encodeBucketObjectKey(
		'issues',
		props.issueId,
		'pages',
		`${props.pageId}.thumbnail.jpg`,
	);
}
