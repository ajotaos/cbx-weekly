import { encodeIssuePagesUploadBucketObjectKey } from '../keys';
import { issuePagesUploadBucketObjectMetadataSchema } from '../types';

import { throwObjectNotFoundError } from '@cbx-weekly/backend-core-s3';

import { GetObjectCommand } from '@aws-sdk/client-s3';

import * as v from '@cbx-weekly/backend-core-valibot';

import type { S3Client } from '@aws-sdk/client-s3';

export async function getIssuePagesUploadObjectFromBucket(
	props: GetIssuePagesUploadObjectFromBucket.Props,
	bucketName: string,
	client: S3Client,
) {
	const { id, issueId } = parseProps(props);

	const key = encodeIssuePagesUploadBucketObjectKey({ id, issueId });

	return client
		.send(
			new GetObjectCommand({
				Bucket: bucketName,
				Key: key,
			}),
		)
		.then(({ Body, Metadata }) => {
			if (Body === undefined) {
				throwObjectNotFoundError('issue_pages_upload', { id, issueId });
			}

			const body = () => Body.transformToByteArray();
			const metadata = parseMetadata(Metadata);

			return { object: { body, metadata } };
		});
}

const parseProps = v.parser(
	v.strictObject({
		id: v.pipe(v.string(), v.id()),
		issueId: v.pipe(v.string(), v.id()),
	}),
);

const parseMetadata = v.parser(issuePagesUploadBucketObjectMetadataSchema);

export declare namespace GetIssuePagesUploadObjectFromBucket {
	type Props = {
		id: string;
		issueId: string;
	};
}
