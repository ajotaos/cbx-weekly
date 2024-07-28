import { makeIssuePageBucketObjectKey } from '../keys';

import { fileTypeFromBuffer } from 'file-type';
import { imageDimensionsFromData } from 'image-dimensions';

import { Upload } from '@aws-sdk/lib-storage';

import { ulid } from 'ulidx';

import * as vx from '@cbx-weekly/backend-comicbook-valibot';
import * as v from 'valibot';

import type { RawIssuePageBucketObject } from '../types';

import type { S3Client } from '@aws-sdk/client-s3';

export type PutIssuePageObjectInBucketProps = {
	index: number;
	issueId: string;
};

export async function putIssuePageObjectInBucket(
	body: Uint8Array,
	props: PutIssuePageObjectInBucketProps,
	bucketName: string,
	client: S3Client,
) {
	const { index, issueId } = parseProps(props);
	const { mimeType, dimensions } =
		await extractBodyProps(body).then(parseBodyProps);

	const id = ulid();
	const key = makeIssuePageBucketObjectKey({ id });

	const metadata = {
		id,
		index: `${index}`,
		'issue-id': issueId,
		'mime-type': mimeType,
		dimensions: `${dimensions.width}x${dimensions.height}`,
	} satisfies RawIssuePageBucketObject['Metadata'];

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

async function extractBodyProps(body: Uint8Array) {
	const mimeType = await fileTypeFromBuffer(body).then(
		(file) => file?.mime ?? 'application/octet-stream',
	);

	const dimensions = imageDimensionsFromData(body) ?? { width: 0, height: 0 };

	return { mimeType, dimensions };
}
