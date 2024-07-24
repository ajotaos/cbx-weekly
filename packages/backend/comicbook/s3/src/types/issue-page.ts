import {
	bucketObject,
	bucketObjectKey,
	bucketObjectMetadata,
} from '@cbx-weekly/backend-core-s3';

import { Readable } from 'node:stream';

import * as vx from '@cbx-weekly/backend-comicbook-valibot';
import * as v from 'valibot';

export const issuePageBucketObjectSchema = bucketObject(
	v.object({
		Key: bucketObjectKey(
			v.strictTuple([
				v.literal('issues'),
				v.literal('pages'),
				v.pipe(
					v.string(),
					v.endsWith('.jpg'),
					v.transform((value) => value.slice(0, -4)),
					vx.ulid(),
				),
			]),
		),
		Body: v.instance(Readable),
		Metadata: bucketObjectMetadata(
			v.object({
				'x-amz-meta-id': v.pipe(v.string(), vx.ulid()),
				'x-amz-meta-mime-type': v.literal('image/jpeg'),
				'x-amz-meta-dimensions': v.pipe(
					v.string(),
					v.transform((value) =>
						value.split('x').map((value) => Number(value)),
					),
					v.strictTuple([
						v.pipe(v.number(), v.integer(), v.minValue(1)),
						v.pipe(v.number(), v.integer(), v.minValue(1)),
					]),
					v.transform((value) => ({ width: value[0], height: value[1] })),
				),
				'x-amz-meta-index': v.pipe(
					v.string(),
					v.transform((value) => Number(value)),
					v.pipe(v.number(), v.integer(), v.minValue(1)),
				),
				'x-amz-meta-issue-id': v.pipe(v.string(), vx.ulid()),
			}),
		),
	}),
);

export type RawIssuePageBucketObject = v.InferInput<
	typeof issuePageBucketObjectSchema
>;
export type IssuePageBucketObject = v.InferOutput<
	typeof issuePageBucketObjectSchema
>;
