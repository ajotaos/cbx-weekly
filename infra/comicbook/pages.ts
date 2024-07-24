import * as dynamodb from './dynamodb';
import * as idempotency from './idempotency';
import * as s3 from './s3';

import { makeFunctionHandlerPathFactory } from '../utils/paths';
import { prefixComponentNameFactory } from '../utils/prefix';

const prefixComponentName = prefixComponentNameFactory('ComicbookPages');
const makeFunctionHandlerPath = makeFunctionHandlerPathFactory(
	'comicbook',
	'pages',
);

const issuePagesQueue = new sst.aws.Queue(
	prefixComponentName('IssuePagesQueue'),
);

issuePagesQueue.subscribe({
	handler: makeFunctionHandlerPath('update-issue-pages'),
	environment: {
		DYNAMODB_TABLE_NAME: dynamodb.table.name,
		S3_BUCKET_NAME: s3.bucket.name,
		IDEMPOTENCY_TABLE_NAME: idempotency.table.name,
	},
	permissions: [
		{ actions: ['s3:UpdateItem'], resources: [dynamodb.table.arn] },
		{
			actions: ['s3:GetObject', 's3:PutObject'],
			resources: [$interpolate`${s3.bucket.name}/*`],
		},
		{
			actions: [
				'dynamodb:GetItem',
				'dynamodb:PutItem',
				'dynamodb:UpdateItem',
				'dynamodb:DeleteItem',
			],
			resources: [idempotency.table.arn],
		},
	],
});

new awsnative.events.Rule(prefixComponentName('PutUploadObjectRule'), {
	eventPattern: {
		source: ['aws.s3'],
		detailType: ['Object Created'],
		detail: {
			'bucket.name': [s3.bucket.name],
			'object.key': [{ wildcard: 'issues/pages/uploads/*.zip' }],
		},
	},
	targets: [
		{
			id: 'IssuePagesQueue',
			arn: issuePagesQueue.arn,
		},
	],
});
