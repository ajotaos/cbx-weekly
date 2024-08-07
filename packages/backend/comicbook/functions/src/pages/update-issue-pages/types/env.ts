import { parseEnvironment } from '@cbx-weekly/backend-core-env';

import * as v from 'valibot';

export const environment = parseEnvironment(
	v.object({
		AWS_REGION: v.pipe(v.string(), v.minLength(1)),
		DYNAMODB_TABLE_NAME: v.pipe(v.string(), v.minLength(1)),
		S3_BUCKET_NAME: v.pipe(v.string(), v.minLength(1)),
		IDEMPOTENCY_TABLE_NAME: v.pipe(v.string(), v.minLength(1)),
	}),
	{
		abortEarly: true,
		abortPipeEarly: true,
	},
);
