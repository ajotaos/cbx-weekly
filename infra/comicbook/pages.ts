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

const updateIssuePagesQueueDLQ = new awsnative.sqs.Queue(
	prefixComponentName('UpdateIssuePagesQueueDLQ'),
);

const updateIssuePagesQueue = new awsnative.sqs.Queue(
	prefixComponentName('UpdateIssuePagesQueue'),
	{
		redrivePolicy: {
			deadLetterTargetArn: updateIssuePagesQueueDLQ.arn,
			maxReceiveCount: 1,
		},
	},
);

const updateIssuePagesFunction = new sst.aws.Function(
	prefixComponentName('UpdateIssuePages'),
	{
		handler: makeFunctionHandlerPath('update-issue-pages'),
		layers: ['arn:aws:lambda:us-east-1:914198884549:layer:sharp-layer:2'],
		nodejs: {
			esbuild: {
				external: ['sharp'],
			},
		},
		// nodejs: {
		// 	install: ['sharp'],
		// },
		environment: {
			DYNAMODB_TABLE_NAME: dynamodb.table.name,
			S3_BUCKET_NAME: s3.bucket.name,
			IDEMPOTENCY_TABLE_NAME: idempotency.table.name,
		},
		permissions: [
			{ actions: ['s3:UpdateItem'], resources: [dynamodb.table.arn] },
			{
				actions: ['s3:GetObject', 's3:PutObject'],
				resources: [$interpolate`${s3.bucket.arn}/*`],
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
			{
				actions: [
					'sqs:ReceiveMessage',
					'sqs:DeleteMessage',
					'sqs:GetQueueAttributes',
				],
				resources: [updateIssuePagesQueue.arn],
			},
		],
		timeout: '2 minutes',
	},
);

const putIssuePagesUploadObjectRule = new awsnative.events.Rule(
	prefixComponentName('PutIssuePagesUploadObjectRule'),
	{
		eventPattern: {
			source: ['aws.s3'],
			'detail-type': ['Object Created'],
			detail: {
				'bucket.name': [s3.bucket.name],
				'object.key': [{ prefix: 'issues/pages/uploads/' }, { suffix: '.zip' }],
			},
		},
		targets: [
			{
				id: 'UpdateIssuePagesQueueTarget',
				arn: updateIssuePagesQueue.arn,
			},
		],
	},
);

new awsnative.sqs.QueueInlinePolicy(
	prefixComponentName('UpdateIssuePagesQueuePolicy'),
	{
		queue: updateIssuePagesQueue.queueUrl,
		policyDocument: $jsonParse(
			aws.iam.getPolicyDocumentOutput({
				statements: [
					{
						principals: [
							{ type: 'Service', identifiers: ['events.amazonaws.com'] },
						],
						actions: ['sqs:SendMessage'],
						resources: [updateIssuePagesQueue.arn],
						conditions: [
							{
								test: 'ArnEquals',
								variable: 'aws:SourceArn',
								values: [putIssuePagesUploadObjectRule.arn],
							},
						],
					},
				],
			}).json,
		),
	},
);

new awsnative.lambda.EventSourceMapping(
	prefixComponentName('UpdateIssuePagesQueueMapping'),
	{
		eventSourceArn: updateIssuePagesQueue.arn,
		functionName: updateIssuePagesFunction.name,
		batchSize: 5,
		functionResponseTypes: ['ReportBatchItemFailures'],
	},
);
