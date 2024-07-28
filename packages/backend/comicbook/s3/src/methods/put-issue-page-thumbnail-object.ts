import { encodeIssuePageThumbnailBucketObjectKey } from '../keys';

import { fileTypeFromBuffer } from 'file-type';
import { imageDimensionsFromData } from 'image-dimensions';

import { Upload } from '@aws-sdk/lib-storage';

import * as vx from '@cbx-weekly/shared-valibot';
import * as v from 'valibot';

import type { IssuePageThumbnailBucketObject } from '../types';

import type { S3Client } from '@aws-sdk/client-s3';

export async function putIssuePageThumbnailObjectInBucket(
	body: Uint8Array,
	props: PutIssuePageThumbnailObjectInBucket.Props,
	bucketName: string,
	client: S3Client,
) {
	const { pageId, issueId } = parseProps(props);
	const { mimeType, dimensions } =
		await extractBodyProps(body).then(parseBodyProps);

	const key = encodeIssuePageThumbnailBucketObjectKey({ pageId, issueId });

	const metadata = {
		dimensions: `${dimensions.width}x${dimensions.height}`,
		'page-id': pageId,
		'issue-id': issueId,
	} satisfies IssuePageThumbnailBucketObject.Metadata.Raw;

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

	return { object: { metadata: { pageId, issueId } } };
}

const parseProps = v.parser(
	v.strictObject({
		pageId: v.pipe(v.string(), vx.ulid()),
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
export declare namespace PutIssuePageThumbnailObjectInBucket {
	type Props = {
		pageId: string;
		issueId: string;
	};
}
