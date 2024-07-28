import {
	bucketObject,
	bucketObjectKey,
	bucketObjectMetadata,
} from '@cbx-weekly/backend-core-s3';

import * as vx from '@cbx-weekly/backend-comicbook-valibot';
import * as v from 'valibot';

export const issuePagesUploadBucketObjectSchema = bucketObject(
	v.object({
		Key: bucketObjectKey(
			v.strictTuple([
				v.literal('issues'),
				v.literal('pages'),
				v.literal('uploads'),
				v.pipe(
					v.string(),
					v.endsWith('.zip'),
					v.transform((value) => value.slice(0, -4)),
					vx.ulid(),
				),
			]),
		),
		Body: v.instance(Uint8Array),
		Metadata: bucketObjectMetadata(
			v.object({
				id: v.pipe(v.string(), vx.ulid()),
				'issue-id': v.pipe(v.string(), vx.ulid()),
				'mime-type': v.literal('application/zip'),
			}),
		),
	}),
);

export type RawIssuePagesUploadBucketObject = v.InferInput<
	typeof issuePagesUploadBucketObjectSchema
>;
export type IssuePagesUploadBucketObject = v.InferOutput<
	typeof issuePagesUploadBucketObjectSchema
>;
