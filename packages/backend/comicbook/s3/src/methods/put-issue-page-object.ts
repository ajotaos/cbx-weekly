import { makeIssuePageBucketObjectKey } from '../keys';

import { fileTypeFromStream } from 'file-type';
import { imageDimensionsFromStream } from 'image-dimensions';

import ExifTransformer from 'exif-be-gone';
import { ReReadable } from 'rereadable-stream';

import { Upload } from '@aws-sdk/lib-storage';

import { ulid } from 'ulidx';

import * as vx from '@cbx-weekly/backend-comicbook-valibot';
import * as v from 'valibot';

import type { RawIssuePageBucketObject } from '../types';

import type { StripAmzMetaPrefixKeys } from '@cbx-weekly/backend-core-s3';

import type { S3Client } from '@aws-sdk/client-s3';

import type { Readable } from 'node:stream';

export type PutIssuePageObjectInBucketProps = {
	index: number;
	issueId: string;
};

export async function putIssuePageObjectInBucket(
	body: Readable,
	props: PutIssuePageObjectInBucketProps,
	bucketName: string,
	client: S3Client,
) {
	const { index, issueId } = parseProps(props);

	const _body = body.pipe(new ExifTransformer()).pipe(new ReReadable());

	const { mimeType, dimensions } =
		await extractBodyProps(_body).then(parseBodyProps);

	const id = ulid();

	const key = makeIssuePageBucketObjectKey({ id });

	const metadata = {
		id,
		'mime-type': mimeType,
		dimensions: `${dimensions.width}x${dimensions.height}`,
		index: `${index}`,
		'issue-id': issueId,
	} satisfies StripAmzMetaPrefixKeys<RawIssuePageBucketObject['Metadata']>;

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
	index: v.pipe(v.number(), v.integer(), v.minValue(0)),
	issueId: v.pipe(v.string(), vx.ulid()),
});

function parseBodyProps(input: unknown) {
	return v.parse(bodyPropsSchema, input, {
		abortEarly: true,
		abortPipeEarly: true,
	});
}

const bodyPropsSchema = v.strictObject({
	mimeType: v.literal('image/jpeg'),
	dimensions: v.strictObject({
		width: v.pipe(v.number(), v.integer(), v.minValue(1)),
		height: v.pipe(v.number(), v.integer(), v.minValue(1)),
	}),
});

async function extractBodyProps(body: ReReadable) {
	const [mimeType, dimensions] = await Promise.all([
		fileTypeFromStream(body.rewind()).then(
			(file) => file?.mime ?? 'application/octet-stream',
		),
		imageDimensionsFromStream(body.rewind()).then((dimensions) => ({
			width: dimensions?.width ?? 0,
			height: dimensions?.height ?? 0,
		})),
	]);

	return { mimeType, dimensions };
}
