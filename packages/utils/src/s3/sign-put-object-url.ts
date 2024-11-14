import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { addSeconds, getUnixTime } from 'date-fns';

import type { Metadata } from './types';

import type { S3Client } from '@aws-sdk/client-s3';

import type { RequestPresigningArguments } from '@smithy/types';

import type { UndefinedOnPartialDeep } from 'type-fest';

export type SignPutObjectUrlInput = {
	bucketName: string;
	key: string;
	contentType?: string | undefined;
	metadata?: Metadata | undefined;
};

export async function signPutObjectUrl(
	client: S3Client,
	input: SignPutObjectUrlInput,
	options?: UndefinedOnPartialDeep<RequestPresigningArguments>,
) {
	const command = new PutObjectCommand({
		Bucket: input.bucketName,
		Key: input.key,
		ContentType: input.contentType,
		Metadata: input.metadata,
	});

	const url = await getSignedUrl(
		client,
		command,
		options as RequestPresigningArguments,
	);
	const expiration = extractSignedUrlExpiration(url);

	return { url, expiration };
}

function extractSignedUrlExpiration(url: string) {
	const _url = new URL(url);

	// Extract `X-Amz-Date` and `X-Amz-Expires` parameters
	// biome-ignore lint/style/noNonNullAssertion: <explanation>
	const amzDate = _url.searchParams.get('X-Amz-Date')!;
	// biome-ignore lint/style/noNonNullAssertion: <explanation>
	const amzExpires = _url.searchParams.get('X-Amz-Expires')!;

	// Parse `X-Amz-Date` to create a Date object (format: YYYYMMDDTHHmmssZ)
	const generatedDate = new Date(
		amzDate.replace(
			/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/,
			'$1-$2-$3T$4:$5:$6Z',
		),
	);

	// Add the expiration duration (in seconds) to the generated date
	const expiresInSeconds = Number.parseInt(amzExpires, 10);

	return getUnixTime(addSeconds(generatedDate, expiresInSeconds));
}
