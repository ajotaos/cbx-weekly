import { environment } from './types/env';
import { recordSchema } from './types/record';

import { updateIssueItemPagesInTable } from '@cbx-weekly/backend-comicbook-dynamodb';
import {
	getIssuePagesUploadObjectFromBucket,
	putIssuePageObjectInBucket,
	putIssuePagesArchiveObjectInBucket,
} from '@cbx-weekly/backend-comicbook-s3';

import {
	createCbzArchiver,
	createZipUnarchiver,
} from '@cbx-weekly/backend-comicbook-files';
import { Idempotency, makeSqs } from '@cbx-weekly/backend-core-functions';

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { S3Client } from '@aws-sdk/client-s3';

import type { IssuePageBucketObject } from '@cbx-weekly/backend-comicbook-s3';

import type { Readable } from 'node:stream';

const dynamodbClient = new DynamoDBClient({ region: environment.AWS_REGION });
const s3Client = new S3Client({ region: environment.AWS_REGION });

const idempotency = new Idempotency({
	tableName: environment.IDEMPOTENCY_TABLE_NAME,
	options: {
		eventKeyJmesPath: '"body"."issueId"',
		expiresAfterSeconds: 180,
	},
});

export const main = makeSqs(recordSchema)
	.idempotent(idempotency)
	.handler(async (record) => {
		const { object: issuePagesUploadObject } =
			await getIssuePagesUploadObjectFromBucket(
				record.body.detail.object.key,
				environment.S3_BUCKET_NAME,
				s3Client,
			);

		const { object } = await putIssuePagesAndArchiveObjectsInBucket(
			issuePagesUploadObject.body,
			{ issueId: issuePagesUploadObject.metadata.issueId },
			environment.S3_BUCKET_NAME,
			s3Client,
		);

		await updateIssueItemPagesInTable(
			{
				id: issuePagesUploadObject.metadata.issueId,
				pageIds: object.metadata.pages.ids,
				archiveId: object.metadata.archive.id,
			},
			environment.DYNAMODB_TABLE_NAME,
			dynamodbClient,
		);
	});

async function putIssuePagesAndArchiveObjectsInBucket(
	body: Readable,
	props: { issueId: string },
	bucketName: string,
	client: S3Client,
) {
	const zipUnarchiver = await createZipUnarchiver(body);
	const cbzArchiver = createCbzArchiver();

	const issuePageIds: Array<string> = [];

	let index = 0;

	for await (const file of zipUnarchiver.files()) {
		const { object: issuePageObject } = await putIssuePageObjectInBucket(
			file.stream(),
			{ index, issueId: props.issueId },
			bucketName,
			client,
		);

		issuePageIds.push(issuePageObject.metadata.id);

		cbzArchiver.page(file.stream(), index);

		index += 1;
	}

	const { object: issuePagesArchiveObject } =
		await putIssuePagesArchiveObjectInBucket(
			cbzArchiver.stream(),
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
