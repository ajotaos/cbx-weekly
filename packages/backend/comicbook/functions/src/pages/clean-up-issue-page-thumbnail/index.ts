import { Resource } from 'sst';

import { recordSchema } from './record';

import { deleteIssuePageThumbnailObjectFromBucket } from '@cbx-weekly/backend-comicbook-s3';

import { createSqs } from '@cbx-weekly/backend-core-functions';

import { S3Client } from '@aws-sdk/client-s3';

const s3Client = new S3Client();

export const main = createSqs(recordSchema)
	.idempotent(Resource.ComicbookIdempotencyTable.name, {
		keyPath: '"body"."detail"."object"."key"',
		expiresAfterSeconds: 30,
	})
	.recordHandler(async (record) => {
		await deleteIssuePageThumbnailObjectFromBucket(
			{
				pageId: record.body.detail.object.key.id,
				issueId: record.body.detail.object.key.issueId,
			},
			Resource.ComicbookS3Bucket.name,
			s3Client,
		);
	});
