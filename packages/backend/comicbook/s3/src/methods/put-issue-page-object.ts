import { encodeIssuePageBucketObjectKey } from '../keys';

import { fileTypeFromBuffer } from 'file-type';
import { imageDimensionsFromData } from 'image-dimensions';

import { Upload } from '@aws-sdk/lib-storage';

import { ulid } from 'ulidx';

import * as vx from '@cbx-weekly/shared-valibot';
import * as v from 'valibot';

import type { IssuePageBucketObject } from '../types';

import type { S3Client } from '@aws-sdk/client-s3';

export async function putIssuePageObjectInBucket(
	body: Uint8Array,
	props: PutIssuePageObjectInBucket.Props,
	bucketName: string,
	client: S3Client,
) {
	const { issueId } = parseProps(props);
	const { mimeType, dimensions } =
		await extractBodyProps(body).then(parseBodyProps);

	const id = ulid().toLowerCase();
	const key = encodeIssuePageBucketObjectKey({ id, issueId });

	const metadata = {
		id,
		dimensions: `${dimensions.width}x${dimensions.height}`,
		'issue-id': issueId,
	} satisfies IssuePageBucketObject.Metadata.Raw;

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

	const dimensions = imageDimensionsFromData(body) ?? { width: 0, height: 0 };

	return { mimeType, dimensions };
}

const parseBodyProps = v.parser(
	v.strictObject({
		mimeType: v.literal('image/jpeg'),
		dimensions: v.strictObject(
			v.entriesFromList(
				['width', 'height'],
				v.pipe(v.number(), v.integer(), v.minValue(1)),
			),
		),
	}),
	{
		abortEarly: true,
		abortPipeEarly: true,
	},
);

export declare namespace PutIssuePageObjectInBucket {
	type Props = {
		issueId: string;
	};
}
