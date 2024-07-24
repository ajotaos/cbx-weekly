import { encodeIssuePageBucketObjectKey } from '../keys';

import { DeleteObjectCommand } from '@aws-sdk/client-s3';

import * as v from '@cbx-weekly/backend-core-valibot';

import type { S3Client } from '@aws-sdk/client-s3';

export async function deleteIssuePageObjectFromBucket(
	props: DeleteIssuePageObjectFromBucket.Props,
	bucketName: string,
	client: S3Client,
) {
	const { id, issueId } = parseProps(props);

	const key = encodeIssuePageBucketObjectKey({ id, issueId });

	await client.send(
		new DeleteObjectCommand({
			Bucket: bucketName,
			Key: key,
		}),
	);
}

const parseProps = v.parser(
	v.strictObject({
		id: v.pipe(v.string(), v.id()),
		issueId: v.pipe(v.string(), v.id()),
	}),
);

export declare namespace DeleteIssuePageObjectFromBucket {
	type Props = {
		id: string;
		issueId: string;
	};
}
