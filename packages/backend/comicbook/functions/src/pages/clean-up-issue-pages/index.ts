import { Resource } from 'sst';

import { recordSchema } from './record';

import {
	deleteIssuePageObjectFromBucket,
	deleteIssuePagesArchiveObjectFromBucket,
} from '@cbx-weekly/backend-comicbook-s3';

import { createSqs } from '@cbx-weekly/backend-core-functions';

import { S3Client } from '@aws-sdk/client-s3';

import { difference } from 'es-toolkit';

const s3Client = new S3Client();

export const main = createSqs(recordSchema)
	.idempotent(Resource.ComicbookIdempotencyTable.name, {
		keyPath: '"body"."dynamodb"."newImage"."latestUpdate"."id"',
		expiresAfterSeconds: 120,
	})
	.recordHandler(async (record) => {
		const { newImage: newIssue, oldImage: oldIssue } = record.body.dynamodb;

		if (oldIssue.pages.archive !== undefined) {
			const issuePagesArchiveIdMarkedForDeletion =
				oldIssue.pages.archive.id !== newIssue.pages.archive?.id
					? oldIssue.pages.archive.id
					: undefined;
			if (issuePagesArchiveIdMarkedForDeletion !== undefined) {
				await deleteIssuePagesArchiveObjectFromBucket(
					{ id: issuePagesArchiveIdMarkedForDeletion, issueId: newIssue.id },
					Resource.ComicbookS3Bucket.name,
					s3Client,
				);
			}

			const issuePageIdsMarkedForDeletion = newIssue.pages.archive !== undefined ? difference(
				oldIssue.pages.archive.pageIds,
				newIssue.pages.archive.pageIds,
			) : oldIssue.pages.archive.pageIds;
			if (issuePageIdsMarkedForDeletion.length > 0) {
				for (const issuePageIdMarkedForDeletion of issuePageIdsMarkedForDeletion) {
					await deleteIssuePageObjectFromBucket(
						{ id: issuePageIdMarkedForDeletion, issueId: newIssue.id },
						Resource.ComicbookS3Bucket.name,
						s3Client,
					);
				}
			}
		}
	});

// function mapIfDefined<T, U>(
// 	value: T | undefined,
// 	fn: (value: T) => U,
// ): U | undefined {
// 	return value !== undefined ? fn(value) : undefined;
// }
