import { encodeIssuePagesArchiveBucketObjectKey } from '../keys';

import { DeleteObjectCommand } from '@aws-sdk/client-s3';

import * as vx from '@cbx-weekly/shared-valibot';
import * as v from 'valibot';

import type { S3Client } from '@aws-sdk/client-s3';

export async function deleteIssuePagesArchiveObjectFromBucket(
	props: DeleteIssuePagesArchiveObjectFromBucket.Props,
	bucketName: string,
	client: S3Client,
) {
	const { id, issueId } = parseProps(props);

	const key = encodeIssuePagesArchiveBucketObjectKey({ id, issueId });

	await client.send(
		new DeleteObjectCommand({
			Bucket: bucketName,
			Key: key,
		}),
	);
}

const parseProps = v.parser(
	v.strictObject({
		id: v.pipe(v.string(), vx.ulid()),
		issueId: v.pipe(v.string(), vx.ulid()),
	}),
	{
		abortEarly: true,
		abortPipeEarly: true,
	},
);

export declare namespace DeleteIssuePagesArchiveObjectFromBucket {
	type Props = {
		id: string;
		issueId: string;
	};
}
