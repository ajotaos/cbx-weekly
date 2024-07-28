import { Resource } from 'sst';

import { eventSchema } from './event';

import { signIssuePagesUploadObjectUrlToBucket } from '@cbx-weekly/backend-comicbook-s3';

import { createApiGateway } from '@cbx-weekly/backend-core-functions';

import { S3Client } from '@aws-sdk/client-s3';

const s3Client = new S3Client();

export const main = createApiGateway(eventSchema)
	.idempotent(Resource.ComicbookIdempotencyTable.name, {
		keyPath: '"pathParameters"."issueId"',
		expiresAfterSeconds: 180,
	})
	.eventHandler(async (event) => {
		const { url, upload } = await signIssuePagesUploadObjectUrlToBucket(
			{
				issueId: event.pathParameters.issueId,
			},
			Resource.ComicbookS3Bucket.name,
			s3Client,
		);

		return {
			statusCode: 200,
			body: { url, upload },
		};
	});
