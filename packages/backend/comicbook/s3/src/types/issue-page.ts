import {
	bucketObject,
	bucketObjectKey,
	bucketObjectMetadata,
} from '@cbx-weekly/backend-core-s3';

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
		Body: v.instance(Uint8Array),
		Metadata: bucketObjectMetadata(
			v.object({
				id: v.pipe(v.string(), vx.ulid()),
				index: v.pipe(
					v.string(),
					v.transform((value) => Number(value)),
					v.pipe(v.number(), v.integer(), v.minValue(1)),
				),
				'issue-id': v.pipe(v.string(), vx.ulid()),
				'mime-type': v.literal('image/jpeg'),
				dimensions: v.pipe(
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
