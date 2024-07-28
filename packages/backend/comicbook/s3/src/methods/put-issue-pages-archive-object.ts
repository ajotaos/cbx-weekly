import { encodeIssuePagesArchiveBucketObjectKey } from '../keys';

import { fileTypeFromBuffer } from 'file-type';

import { Upload } from '@aws-sdk/lib-storage';

import { ulid } from 'ulidx';

import * as vx from '@cbx-weekly/shared-valibot';
import * as v from 'valibot';

import type { IssuePagesArchiveBucketObject } from '../types';

import type { S3Client } from '@aws-sdk/client-s3';

export async function putIssuePagesArchiveObjectInBucket(
	body: Uint8Array,
	props: PutIssuePagesArchiveObjectInBucket.Props,
	bucketName: string,
	client: S3Client,
) {
	const { issueId } = parseProps(props);
	const { mimeType } = await extractBodyProps(body).then(parseBodyProps);

	const id = ulid().toLowerCase();
	const key = encodeIssuePagesArchiveBucketObjectKey({ id, issueId });

	const metadata = {
		id,
		'issue-id': issueId,
	} satisfies IssuePagesArchiveBucketObject.Metadata.Raw;

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

	return { object: { metadata: { id, issueId } } };
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

async function extractBodyProps(body: Uint8Array) {
	const mimeType = await fileTypeFromBuffer(body).then(
		(file) => file?.mime ?? 'application/octet-stream',
	);

	return { mimeType };
}

const parseBodyProps = v.parser(
	v.strictObject({
		mimeType: v.literal('application/zip'),
	}),
	{
		abortEarly: true,
		abortPipeEarly: true,
	},
);

export declare namespace PutIssuePagesArchiveObjectInBucket {
	type Props = {
		issueId: string;
	};
}
