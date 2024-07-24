import { environment } from './types/env';
import { eventSchema } from './types/event';

import { signIssuePagesUploadObjectUrlToBucket } from '@cbx-weekly/backend-comicbook-s3';

import {
	Idempotency,
	makeApiGateway,
} from '@cbx-weekly/backend-core-functions';

import { S3Client } from '@aws-sdk/client-s3';

const s3Client = new S3Client({ region: environment.AWS_REGION });

const idempotency = new Idempotency({
	tableName: environment.IDEMPOTENCY_TABLE_NAME,
	options: {
		eventKeyJmesPath: '"body"."issueId"',
		expiresAfterSeconds: 15,
	},
});

export const main = makeApiGateway(eventSchema)
	.idempotent(idempotency)
	.handler(async (event) => {
		const { upload } = await signIssuePagesUploadObjectUrlToBucket(
			{
				issueId: event.body.issueId,
			},
			environment.S3_BUCKET_NAME,
			s3Client,
		);

		return {
			statusCode: 200,
			body: { upload },
		};
	});
