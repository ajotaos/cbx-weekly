import {
	bucketObject,
	bucketObjectKey,
	bucketObjectMetadata,
} from '@cbx-weekly/backend-core-s3';

import { Readable } from 'node:stream';

import * as vx from '@cbx-weekly/backend-comicbook-valibot';
import * as v from 'valibot';

export const issuePagesArchiveBucketObjectSchema = bucketObject(
	v.object({
		Key: bucketObjectKey(
			v.strictTuple([
				v.literal('issues'),
				v.literal('pages'),
				v.literal('archives'),
				v.pipe(
					v.string(),
					v.endsWith('.cbz'),
					v.transform((value) => value.slice(0, -4)),
					vx.ulid(),
				),
			]),
		),
		Body: v.instance(Readable),
		Metadata: bucketObjectMetadata(
			v.object({
				'x-amz-meta-id': v.pipe(v.string(), vx.ulid()),
				'x-amz-meta-mime-type': v.literal('application/zip'),
				'x-amz-meta-issue-id': v.pipe(v.string(), vx.ulid()),
			}),
		),
	}),
);

export type RawIssuePagesArchiveBucketObject = v.InferInput<
	typeof issuePagesArchiveBucketObjectSchema
>;
export type IssuePagesArchiveBucketObject = v.InferOutput<
	typeof issuePagesArchiveBucketObjectSchema
>;
