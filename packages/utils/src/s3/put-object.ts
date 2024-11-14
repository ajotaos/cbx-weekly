import { Upload } from '@aws-sdk/lib-storage';

import type { Metadata } from './types';

import type { S3Client } from '@aws-sdk/client-s3';

import type { Simplify } from 'type-fest';

export type PutObjectInput = {
	bucketName: string;
	key: string;
	body: string | Uint8Array;
	contentType?: string | undefined;
	metadata?: Metadata | undefined;
};

export async function putObject(
	client: S3Client,
	input: PutObjectInput,
	options?: Simplify<
		Pick<
			ConstructorParameters<typeof Upload>[0],
			'queueSize' | 'partSize' | 'tags' | 'abortController'
		>
	>,
) {
	const upload = new Upload({
		client,
		params: {
			Bucket: input.bucketName,
			Key: input.key,
			Body: input.body,
			ContentType: input.contentType,
			Metadata: input.metadata,
		},
		...options,
	});

	await upload.done();
}
