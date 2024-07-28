import { encodeIssuePageBucketObjectKey } from '../keys';
import { issuePageBucketObjectMetadataSchema } from '../types';

import { throwObjectNotFoundError } from '@cbx-weekly/backend-core-s3';

import { GetObjectCommand } from '@aws-sdk/client-s3';

import * as vx from '@cbx-weekly/shared-valibot';
import * as v from 'valibot';

import type { GetObjectCommandOutput, S3Client } from '@aws-sdk/client-s3';

export async function getIssuePageObjectFromBucket(
	props: GetIssuePageObjectFromBucket.Props,
	bucketName: string,
	client: S3Client,
) {
	const { id, issueId } = parseProps(props);

	const key = encodeIssuePageBucketObjectKey({ id, issueId });

	const object = await client
		.send(
			new GetObjectCommand({
				Bucket: bucketName,
				Key: key,
			}),
		)
		.then(parseOutput);

	if (object === undefined) {
		throwObjectNotFoundError('issue_page', { id, issueId });
	}

	return { object };
}

const parseProps = v.parser(
	v.strictObject({
		id: v.pipe(v.string(), vx.ulid()),
		issueId: v.pipe(v.string(), vx.ulid()),
	}),
	{
		abortEarly: true,
		abortPipeEarly: true,
	},
);

const parseOutput = v.parser(
	v.union([
		v.pipe(
			v.object({
				Body: v.undefined(),
			}),
			v.transform(() => undefined),
		),
		v.pipe(
			v.object({
				Body: v.custom<NonNullable<GetObjectCommandOutput['Body']>>(
					(value) =>
						typeof value === 'object' &&
						value !== null &&
						'transformToByteArray' in value,
				),
				Metadata: issuePageBucketObjectMetadataSchema,
			}),
			v.transform((value) => ({
				body: () => value.Body.transformToByteArray(),
				metadata: value.Metadata,
			})),
		),
	]),
	{
		abortEarly: true,
		abortPipeEarly: true,
	},
);

export declare namespace GetIssuePageObjectFromBucket {
	type Props = {
		id: string;
		issueId: string;
	};
}
