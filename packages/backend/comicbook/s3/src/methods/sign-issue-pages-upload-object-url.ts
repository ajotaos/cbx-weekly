import { encodeIssuePagesUploadBucketObjectKey } from '../keys';

import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { ulid } from 'ulidx';

import * as v from '@cbx-weekly/backend-core-valibot';

import type { IssuePagesUpload } from '../types';

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
	} satisfies IssuePagesUpload.BucketObject.Metadata.Raw;

	const url = await getSignedUrl(
		client,
		new PutObjectCommand({
			Bucket: bucketName,
			Key: key,
			Metadata: metadata,
			ContentType: mimeType
		}),
		{
			expiresIn: 3 * 60,
		},
	);

	return { url };
}

const parseProps = v.parser(
	v.strictObject({
		issueId: v.pipe(v.string(), v.id()),
	}),
);

export declare namespace SignIssuePagesUploadObjectUrlToBucket {
	type Props = {
		issueId: string;
	};
}
