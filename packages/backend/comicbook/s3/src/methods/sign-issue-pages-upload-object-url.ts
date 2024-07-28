import { encodeIssuePagesUploadBucketObjectKey } from '../keys';

import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { ulid } from 'ulidx';

import * as vx from '@cbx-weekly/shared-valibot';
import * as v from 'valibot';

import type { IssuePagesUploadBucketObject } from '../types';

import type { S3Client } from '@aws-sdk/client-s3';

export async function signIssuePagesUploadObjectUrlToBucket(
	props: SignIssuePagesUploadObjectUrlToBucket.Props,
	bucketName: string,
	client: S3Client,
) {
	const { issueId } = parseProps(props);

	const id = ulid().toLowerCase();
	const key = encodeIssuePagesUploadBucketObjectKey({ id, issueId });

	const mimeType = 'application/zip';

	const metadata = {
		id,
		'issue-id': issueId,
	} satisfies IssuePagesUploadBucketObject.Metadata.Raw;

	const url = await getSignedUrl(
		client,
		new PutObjectCommand({
			Bucket: bucketName,
			Key: key,
			Metadata: metadata,
			ContentType: `${mimeType}`,
		}),
		{
			// expiresIn: 3 * 60,
		},
	);

	return { url, upload: { id, issueId } };
}

const parseProps = v.parser(
	v.strictObject({
		issueId: v.pipe(v.string(), vx.ulid()),
	}),
	{
		abortEarly: true,
		abortPipeEarly: true,
	},
);

export declare namespace SignIssuePagesUploadObjectUrlToBucket {
	type Props = {
		issueId: string;
	};
}
