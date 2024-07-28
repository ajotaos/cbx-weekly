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

import * as v from 'valibot';

const dynamodbClient = new DynamoDBClient({ region: environment.AWS_REGION });
const s3Client = new S3Client({
	region: environment.AWS_REGION,
	forcePathStyle: true,
});

const idempotency = new Idempotency({
	tableName: environment.IDEMPOTENCY_TABLE_NAME,
	options: {
		eventKeyJmesPath: '"body"."detail"."object"."key"',
		expiresAfterSeconds: 180,
	},
});

export const main = makeSqs(recordSchema)
	// .idempotent(idempotency)
	.handler(async (record) => {
		const { object: issuePagesUploadObject } =
			await getIssuePagesUploadObjectFromBucket(
				record.body.detail.object.key,
				environment.S3_BUCKET_NAME,
				s3Client,
			);

		console.log('Got issue pages upload object');
		// console.log(JSON.stringify(issuePagesUploadObject.metadata, null, 2));

		const upload = await issuePagesUploadObject.body();

		const { object } = await putIssuePagesAndArchiveObjectsInBucket(
			upload,
			{ issueId: issuePagesUploadObject.metadata.issueId },
			environment.S3_BUCKET_NAME,
			s3Client,
		);

		// console.log(JSON.stringify(object.metadata, null, 2));

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
	upload: Uint8Array,
	props: { issueId: string },
	bucketName: string,
	client: S3Client,
) {
	try {
		const unarchiver = await createZipUnarchiver(upload);
		console.log('Created unarchiver');
		const archiver = createCbzArchiver();
		console.log('Created archiver');

		const issuePageIds: Array<string> = [];

		let index = 0;

		for await (const file of unarchiver.files()) {
			const page = await file.buffer();

			const { object: issuePageObject } = await putIssuePageObjectInBucket(
				page,
				{ index, issueId: props.issueId },
				bucketName,
				client,
			);
			console.log('Put issue page object', index);

			// console.log(JSON.stringify(issuePageObject.metadata, null, 2));

			issuePageIds.push(issuePageObject.metadata.id);

			archiver.page(page, index);

			index += 1;
		}

		console.log('Put all issue page objects');

		const archive = await archiver.stream();

		const { object: issuePagesArchiveObject } =
			await putIssuePagesArchiveObjectInBucket(
				archive,
				{ issueId: props.issueId },
				bucketName,
				client,
			);

		console.log('Put issue pages archive object');
		// console.log(JSON.stringify(issuePagesArchiveObject.metadata, null, 2));

		return {
			object: {
				metadata: {
					pages: { ids: issuePageIds },
					archive: { id: issuePagesArchiveObject.metadata.id },
				},
			},
		};
	} catch (error) {
		if (error instanceof v.ValiError) {
			console.log(v.flatten(error.issues));
		} else {
			console.log(error);
		}

		throw error;
	}
}
