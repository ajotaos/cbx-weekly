import { encodeIssuePagesUploadBucketObjectKey } from '../keys';

import { DeleteObjectCommand } from '@aws-sdk/client-s3';

import * as vx from '@cbx-weekly/shared-valibot';
import * as v from 'valibot';

import type { S3Client } from '@aws-sdk/client-s3';

export async function deleteIssuePagesUploadObjectFromBucket(
	props: DeleteIssuePagesUploadObjectFromBucket.Props,
	bucketName: string,
	client: S3Client,
) {
	const { id, issueId } = parseProps(props);

	const key = encodeIssuePagesUploadBucketObjectKey({ id, issueId });

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

export declare namespace DeleteIssuePagesUploadObjectFromBucket {
	type Props = {
		id: string;
		issueId: string;
	};
}
