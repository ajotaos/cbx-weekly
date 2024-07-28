import { makeIssuePagesUploadBucketObjectKey } from '../keys';

import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { ulid } from 'ulidx';

import * as vx from '@cbx-weekly/backend-comicbook-valibot';
import * as v from 'valibot';

import type { RawIssuePagesUploadBucketObject } from '../types';

import type { S3Client } from '@aws-sdk/client-s3';

export type SignIssuePagesUploadObjectUrlToBucketProps = {
	issueId: string;
};

export async function signIssuePagesUploadObjectUrlToBucket(
	props: SignIssuePagesUploadObjectUrlToBucketProps,
	bucketName: string,
	client: S3Client,
) {
	const { issueId } = parseProps(props);

	const id = ulid();
	const key = makeIssuePagesUploadBucketObjectKey({ id });

	const mimeType = 'application/zip';

	const metadata = {
		id,
		'issue-id': issueId,
		'mime-type': mimeType,
	} satisfies RawIssuePagesUploadBucketObject['Metadata'];

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

	return { upload: { id, url } };
}

function parseProps(input: unknown) {
	return v.parse(propsSchema, input, {
		abortEarly: true,
		abortPipeEarly: true,
	});
}

const propsSchema = v.strictObject({
	issueId: v.pipe(v.string(), vx.ulid()),
});
