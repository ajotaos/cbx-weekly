import { Resource } from 'sst';

import { recordSchema } from './record';

import { updateIssueItemPagesInTable } from '@cbx-weekly/backend-comicbook-dynamodb';
import {
	deleteIssuePagesUploadObjectFromBucket,
	getIssuePagesUploadObjectFromBucket,
	putIssuePageObjectInBucket,
	putIssuePagesArchiveObjectInBucket,
} from '@cbx-weekly/backend-comicbook-s3';

import { createIssuePagesArchive } from '@cbx-weekly/backend-comicbook-files';

import { createSqs } from '@cbx-weekly/backend-core-functions';

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { S3Client } from '@aws-sdk/client-s3';

const dynamodbClient = new DynamoDBClient();
const s3Client = new S3Client();

export const main = createSqs(recordSchema)
	.idempotent(Resource.ComicbookIdempotencyTable.name, {
		keyPath: '"body"."detail"."object"."key"',
		expiresAfterSeconds: 300,
	})
	.recordHandler(async (record) => {
		const { id: issuePagesUploadId, issueId } = record.body.detail.object.key;

		const { object: issuePagesUploadObject } =
			await getIssuePagesUploadObjectFromBucket(
				{
					id: issuePagesUploadId,
					issueId,
				},
				Resource.ComicbookS3Bucket.name,
				s3Client,
			);

		const issuePagesUpload = await issuePagesUploadObject.body();

		const issuePageIds: Array<string> = [];

		const issuePagesArchive = await createIssuePagesArchive(
			issuePagesUpload,
			async (issuePage) => {
				const { object: issuePageObject } = await putIssuePageObjectInBucket(
					issuePage,
					{ issueId },
					Resource.ComicbookS3Bucket.name,
					s3Client,
				);

				issuePageIds.push(issuePageObject.metadata.id);
			},
		);

		const { object: issuePagesArchiveObject } =
			await putIssuePagesArchiveObjectInBucket(
				issuePagesArchive,
				{ issueId },
				Resource.ComicbookS3Bucket.name,
				s3Client,
			);

		await updateIssueItemPagesInTable(
			{
				id: issueId,
				archive: {
					id: issuePagesArchiveObject.metadata.id,
					pageIds: issuePageIds,
				},
			},
			Resource.ComicbookDynamodbTable.name,
			dynamodbClient,
		);

		await deleteIssuePagesUploadObjectFromBucket(
			{
				id: issuePagesUploadId,
				issueId,
			},
			Resource.ComicbookS3Bucket.name,
			s3Client,
		);
	});
