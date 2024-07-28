import { Resource } from 'sst';

import { recordSchema } from './record';

import {
	getIssuePageObjectFromBucket,
	putIssuePageThumbnailObjectInBucket,
} from '@cbx-weekly/backend-comicbook-s3';

import { createIssuePageThumbnail } from '@cbx-weekly/backend-comicbook-files';

import { createSqs } from '@cbx-weekly/backend-core-functions';

import { S3Client } from '@aws-sdk/client-s3';

const s3Client = new S3Client();

export const main = createSqs(recordSchema)
	.idempotent(Resource.ComicbookIdempotencyTable.name, {
		keyPath: '"body"."detail"."object"."key"',
		expiresAfterSeconds: 30,
	})
	.recordHandler(async (record) => {
		const { object: issuePageObject } = await getIssuePageObjectFromBucket(
			{
				id: record.body.detail.object.key.id,
				issueId: record.body.detail.object.key.issueId,
			},
			Resource.ComicbookS3Bucket.name,
			s3Client,
		);

		const issuePage = await issuePageObject.body();
		const issuePageThumbnail = await createIssuePageThumbnail(issuePage);

		await putIssuePageThumbnailObjectInBucket(
			issuePageThumbnail,
			{
				pageId: issuePageObject.metadata.id,
				issueId: issuePageObject.metadata.issueId,
			},
			Resource.ComicbookS3Bucket.name,
			s3Client,
		);
	});
