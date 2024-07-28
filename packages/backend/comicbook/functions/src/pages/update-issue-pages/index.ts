import { Resource } from 'sst';

import { recordSchema } from './record';

import { updateIssueItemPagesInTable } from '@cbx-weekly/backend-comicbook-dynamodb';
import {
	deleteIssuePagesUploadObjectFromBucket,
	getIssuePagesUploadObjectFromBucket,
	putIssuePageObjectInBucket,
	putIssuePagesArchiveObjectInBucket,
} from '@cbx-weekly/backend-comicbook-s3';

import {
	createIssuePagesArchiver,
	createIssuePagesUploadUnarchiver,
} from '@cbx-weekly/backend-comicbook-files';

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
		const { object: issuePagesUploadObject } =
			await getIssuePagesUploadObjectFromBucket(
				{
					id: record.body.detail.object.key.id,
					issueId: record.body.detail.object.key.issueId,
				},
				Resource.ComicbookS3Bucket.name,
				s3Client,
			);

		const issuePagesUpload = await issuePagesUploadObject.body();

		const { object } = await putIssuePagesAndArchiveObjectsInBucket(
			issuePagesUpload,
			{ issueId: issuePagesUploadObject.metadata.issueId },
			Resource.ComicbookS3Bucket.name,
			s3Client,
		);

		await updateIssueItemPagesInTable(
			{
				id: issuePagesUploadObject.metadata.issueId,
				pageIds: object.metadata.pages.ids,
				archiveId: object.metadata.archive.id,
			},
			Resource.ComicbookDynamodbTable.name,
			dynamodbClient,
		);

		await deleteIssuePagesUploadObjectFromBucket(
			{
				id: issuePagesUploadObject.metadata.id,
				issueId: issuePagesUploadObject.metadata.issueId,
			},
			Resource.ComicbookS3Bucket.name,
			s3Client,
		);
	});

async function putIssuePagesAndArchiveObjectsInBucket(
	body: Uint8Array,
	props: { issueId: string },
	bucketName: string,
	client: S3Client,
) {
	const issuePagesUploadUnarchiver =
		await createIssuePagesUploadUnarchiver(body);
	const issuePagesArchiver = createIssuePagesArchiver();

	const issuePageIds: Array<string> = [];

	for await (const file of issuePagesUploadUnarchiver.files()) {
		const issuePage = await file.buffer();

		const { object: issuePageObject } = await putIssuePageObjectInBucket(
			issuePage,
			{ issueId: props.issueId },
			bucketName,
			client,
		);

		issuePagesArchiver.page(issuePage, issuePageIds.length);

		issuePageIds.push(issuePageObject.metadata.id);
	}

	const issuePage = await issuePagesArchiver.buffer();

	const { object: issuePagesArchiveObject } =
		await putIssuePagesArchiveObjectInBucket(
			issuePage,
			{ issueId: props.issueId },
			bucketName,
			client,
		);

	return {
		object: {
			metadata: {
				pages: { ids: issuePageIds },
				archive: { id: issuePagesArchiveObject.metadata.id },
			},
		},
	};
}
