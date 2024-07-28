import { makeIssuePagesArchiveBucketObjectKey } from '../keys';

import { fileTypeFromBuffer } from 'file-type';

import { Upload } from '@aws-sdk/lib-storage';

import { ulid } from 'ulidx';

import * as vx from '@cbx-weekly/backend-comicbook-valibot';
import * as v from 'valibot';

import type { RawIssuePagesArchiveBucketObject } from '../types';

import type { S3Client } from '@aws-sdk/client-s3';

export type PutIssuePagesArchiveObjectInBucketProps = {
	issueId: string;
};

export async function putIssuePagesArchiveObjectInBucket(
	body: Uint8Array,
	props: PutIssuePagesArchiveObjectInBucketProps,
	bucketName: string,
	client: S3Client,
) {
	const { issueId } = parseProps(props);
	const { mimeType } = await extractBodyProps(body).then(parseBodyProps);

	const id = ulid();
	const key = makeIssuePagesArchiveBucketObjectKey({ id });

	const metadata = {
		id,
		'issue-id': issueId,
		'mime-type': mimeType,
	} satisfies RawIssuePagesArchiveBucketObject['Metadata'];

	const upload = new Upload({
		client,
		params: {
			Bucket: bucketName,
			Key: key,
			Body: body,
			Metadata: metadata,
			ContentType: mimeType,
		},
	});

	await upload.done();

	return { object: { metadata: { id } } };
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

function parseBodyProps(input: unknown) {
	return v.parse(bodyPropsSchema, input, {
		abortEarly: true,
		abortPipeEarly: true,
	});
}

const bodyPropsSchema = v.strictObject({
	mimeType: v.literal('application/zip'),
});

async function extractBodyProps(body: Uint8Array) {
	const mimeType = await fileTypeFromBuffer(body).then(
		(file) => file?.mime ?? 'application/octet-stream',
	);

	return { mimeType };
}
