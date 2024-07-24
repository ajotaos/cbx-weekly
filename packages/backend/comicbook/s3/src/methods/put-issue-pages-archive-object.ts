import { makeIssuePagesArchiveBucketObjectKey } from '../keys';

import { fileTypeFromStream } from 'file-type';

import ExifTransformer from 'exif-be-gone';
import { ReReadable } from 'rereadable-stream';

import { Upload } from '@aws-sdk/lib-storage';

import { ulid } from 'ulidx';

import * as vx from '@cbx-weekly/backend-comicbook-valibot';
import * as v from 'valibot';

import type { RawIssuePagesArchiveBucketObject } from '../types';

import type { StripAmzMetaPrefixKeys } from '@cbx-weekly/backend-core-s3';

import type { S3Client } from '@aws-sdk/client-s3';

import type { Readable } from 'node:stream';

export type PutIssuePagesArchiveObjectInBucketProps = {
	issueId: string;
};

export async function putIssuePagesArchiveObjectInBucket(
	body: Readable,
	props: PutIssuePagesArchiveObjectInBucketProps,
	bucketName: string,
	client: S3Client,
) {
	const { issueId } = parseProps(props);

	const _body = body.pipe(new ExifTransformer()).pipe(new ReReadable());

	const { mimeType } = await extractBodyProps(_body).then(parseBodyProps);

	const id = ulid();

	const key = makeIssuePagesArchiveBucketObjectKey({ id });

	const metadata = {
		id,
		'mime-type': mimeType,
		'issue-id': issueId,
	} satisfies StripAmzMetaPrefixKeys<
		RawIssuePagesArchiveBucketObject['Metadata']
	>;

	const upload = new Upload({
		client,
		params: {
			Bucket: bucketName,
			Key: key,
			Body: _body.rewind(),
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

async function extractBodyProps(body: ReReadable) {
	const mime = await fileTypeFromStream(body.rewind()).then(
		(file) => file?.mime ?? 'application/octet-stream',
	);

	return { mime };
}
