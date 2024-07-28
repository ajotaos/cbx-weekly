import { makeIssuePagesUploadBucketObjectKey } from '../keys';
import { issuePagesUploadBucketObjectSchema } from '../types';

import { GetObjectCommand } from '@aws-sdk/client-s3';

import { throwNotFoundError } from '@cbx-weekly/backend-core-errors';

import * as vx from '@cbx-weekly/backend-comicbook-valibot';
import * as v from 'valibot';

import type { S3Client } from '@aws-sdk/client-s3';

export type GetIssuePagesUploadObjectFromBucketProps =
	| {
			id: string;
	  }
	| string;

export async function getIssuePagesUploadObjectFromBucket(
	props: GetIssuePagesUploadObjectFromBucketProps,
	bucketName: string,
	client: S3Client,
) {
	const key =
		typeof props === 'string'
			? props
			: makeIssuePagesUploadBucketObjectKey(parseProps(props));

	const object = await client
		.send(
			new GetObjectCommand({
				Bucket: bucketName,
				Key: key,
			}),
		)
		.then((output) =>
			output.Body
				? {
						key,
						// biome-ignore lint/style/noNonNullAssertion: <explanation>
						body: () => output.Body!.transformToByteArray(),
						metadata: parseBucketObjectMetadata(output.Metadata),
					}
				: throwNotFoundError(),
		);

	return { object };
}

function parseBucketObjectMetadata(input: unknown) {
	return v.parse(issuePagesUploadBucketObjectSchema.entries.Metadata, input, {
		abortEarly: true,
		abortPipeEarly: true,
	});
}

function parseProps(input: unknown) {
	return v.parse(propsSchema, input, {
		abortEarly: true,
		abortPipeEarly: true,
	});
}

const propsSchema = v.strictObject({
	id: v.pipe(v.string(), vx.ulid()),
});
