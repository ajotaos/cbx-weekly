import { encodeIssuePageThumbnailBucketObjectKey } from '../keys';

import { DeleteObjectCommand } from '@aws-sdk/client-s3';

import * as vx from '@cbx-weekly/shared-valibot';
import * as v from 'valibot';

import type { S3Client } from '@aws-sdk/client-s3';

export async function deleteIssuePageThumbnailObjectFromBucket(
	props: DeleteIssuePageThumbnailObjectFromBucket.Props,
	bucketName: string,
	client: S3Client,
) {
	const { pageId, issueId } = parseProps(props);

	const key = encodeIssuePageThumbnailBucketObjectKey({ pageId, issueId });

	await client.send(
		new DeleteObjectCommand({
			Bucket: bucketName,
			Key: key,
		}),
	);
}

const parseProps = v.parser(
	v.strictObject({
		pageId: v.pipe(v.string(), vx.ulid()),
		issueId: v.pipe(v.string(), vx.ulid()),
	}),
	{
		abortEarly: true,
		abortPipeEarly: true,
	},
);

export declare namespace DeleteIssuePageThumbnailObjectFromBucket {
	type Props = {
		pageId: string;
		issueId: string;
	};
}
