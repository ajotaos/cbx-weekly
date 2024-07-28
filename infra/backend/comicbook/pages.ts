import * as dynamodb from './dynamodb';
import * as idempotency from './idempotency';
import * as s3 from './s3';

import { backendServicePaths } from '../utils/paths';

import { prefix } from '../../utils/prefix';

const prefixComponentName = prefix('ComicbookPages');

const { makeLambdaFunctionHandlerPath } = backendServicePaths(
	'comicbook',
	'pages',
);

const updateIssuePagesQueueDLQ = new sst.aws.Queue(
	prefixComponentName('UpdateIssuePagesQueueDLQ'),
);

const updateIssuePagesQueue = new sst.aws.Queue(
	prefixComponentName('UpdateIssuePagesQueue'),
	{
		visibilityTimeout: '5 minutes',
		dlq: {
			queue: updateIssuePagesQueueDLQ.arn,
			retry: 1,
		},
	},
);

updateIssuePagesQueue.subscribe(
	{
		handler: makeLambdaFunctionHandlerPath('update-issue-pages'),
		nodejs: {
			install: ['sharp'],
		},
		permissions: [
			{ actions: ['dynamodb:UpdateItem'], resources: [dynamodb.table.arn] },
			{
				actions: ['s3:GetObject', 's3:PutObject', 's3:DeleteObject'],
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
		link: [dynamodb.table, s3.bucket, idempotency.table],
		memory: '2048 MB',
		timeout: '3 minutes',
	},
	{
		batch: {
			size: 5,
			partialResponses: true,
		},
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
				'object.key': [{ wildcard: 'issues/*/pages/uploads/*.zip' }],
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

new aws.sqs.QueuePolicy(prefixComponentName('UpdateIssuePagesQueuePolicy'), {
	queueUrl: updateIssuePagesQueue.url,
	policy: aws.iam.getPolicyDocumentOutput({
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
});

const cleanUpIssuePagesQueueDLQ = new sst.aws.Queue(
	prefixComponentName('CleanUpIssuePagesQueueDLQ'),
);

const cleanUpIssuePagesQueue = new sst.aws.Queue(
	prefixComponentName('CleanUpIssuePagesQueue'),
	{
		visibilityTimeout: '2 minutes',
		dlq: {
			queue: cleanUpIssuePagesQueueDLQ.arn,
			retry: 1,
		},
	},
);

cleanUpIssuePagesQueue.subscribe(
	{
		handler: makeLambdaFunctionHandlerPath('clean-up-issue-pages'),
		permissions: [
			{
				actions: ['s3:DeleteObject'],
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
		link: [s3.bucket, idempotency.table],
		timeout: '1 minute',
	},
	{
		batch: {
			size: 5,
			partialResponses: true,
		},
	},
);

const cleanUpIssuePagesPipeRole = new aws.iam.Role(
	prefixComponentName('CleanUpIssuePagesPipeRole'),
	{
		assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal({
			Service: 'pipes.amazonaws.com',
		}),
		inlinePolicies: [
			{
				policy: aws.iam.getPolicyDocumentOutput({
					statements: [
						{
							actions: [
								'dynamodb:DescribeStream',
								'dynamodb:GetRecords',
								'dynamodb:GetShardIterator',
								'dynamodb:ListStreams',
							],
							resources: [dynamodb.table.nodes.table.streamArn],
						},
						{
							actions: ['sqs:SendMessage'],
							resources: [cleanUpIssuePagesQueue.arn],
						},
					],
				}).json,
			},
		],
	},
);

new awsnative.pipes.Pipe(prefixComponentName('CleanUpIssuePagesPipe'), {
	roleArn: cleanUpIssuePagesPipeRole.arn,
	source: dynamodb.table.nodes.table.streamArn,
	sourceParameters: {
		dynamoDbStreamParameters: {
			startingPosition: 'TRIM_HORIZON',
		},
		filterCriteria: {
			filters: [
				{
					pattern: $jsonStringify({
						eventName: ['MODIFY'],
						dynamodb: {
							NewImage: {
								Pk: {
									S: [
										{
											prefix: 'issues:id:',
										},
									],
								},
								LatestUpdate: {
									M: {
										Kind: {
											S: ['pages'],
										},
									},
								},
							},
						},
					}),
				},
			],
		},
	},
	target: cleanUpIssuePagesQueue.arn,
});

const updateIssuePageThumbnailQueueDLQ = new sst.aws.Queue(
	prefixComponentName('UpdateIssuePageThumbnailQueueDLQ'),
);

const updateIssuePageThumbnailQueue = new sst.aws.Queue(
	prefixComponentName('UpdateIssuePageThumbnailQueue'),
	{
		dlq: {
			queue: updateIssuePageThumbnailQueueDLQ.arn,
			retry: 1,
		},
	},
);

updateIssuePageThumbnailQueue.subscribe(
	{
		handler: makeLambdaFunctionHandlerPath('update-issue-page-thumbnail'),
		nodejs: {
			install: ['sharp'],
		},
		permissions: [
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
		link: [s3.bucket, idempotency.table],
	},
	{
		batch: {
			size: 5,
			partialResponses: true,
		},
	},
);

const putIssuePageObjectRule = new awsnative.events.Rule(
	prefixComponentName('PutIssuePageObjectRule'),
	{
		eventPattern: {
			source: ['aws.s3'],
			'detail-type': ['Object Created'],
			detail: {
				'bucket.name': [s3.bucket.name],
				'object.key': [{ wildcard: 'issues/*/pages/*.raw.jpg' }],
			},
		},
		targets: [
			{
				id: 'UpdateIssuePageThumbnailQueueTarget',
				arn: updateIssuePageThumbnailQueue.arn,
			},
		],
	},
);

new aws.sqs.QueuePolicy(
	prefixComponentName('UpdateIssuePageThumbnailQueuePolicy'),
	{
		queueUrl: updateIssuePageThumbnailQueue.url,
		policy: aws.iam.getPolicyDocumentOutput({
			statements: [
				{
					principals: [
						{ type: 'Service', identifiers: ['events.amazonaws.com'] },
					],
					actions: ['sqs:SendMessage'],
					resources: [updateIssuePageThumbnailQueue.arn],
					conditions: [
						{
							test: 'ArnEquals',
							variable: 'aws:SourceArn',
							values: [putIssuePageObjectRule.arn],
						},
					],
				},
			],
		}).json,
	},
);

const cleanUpIssuePageThumbnailQueueDLQ = new sst.aws.Queue(
	prefixComponentName('CleanUpIssuePageThumbnailQueueDLQ'),
);

const cleanUpIssuePageThumbnailQueue = new sst.aws.Queue(
	prefixComponentName('CleanUpIssuePageThumbnailQueue'),
	{
		dlq: {
			queue: cleanUpIssuePageThumbnailQueueDLQ.arn,
			retry: 1,
		},
	},
);

cleanUpIssuePageThumbnailQueue.subscribe(
	{
		handler: makeLambdaFunctionHandlerPath('clean-up-issue-page-thumbnail'),
		permissions: [
			{
				actions: ['s3:DeleteObject'],
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
		link: [s3.bucket, idempotency.table],
	},
	{
		batch: {
			size: 5,
			partialResponses: true,
		},
	},
);

const deleteIssuePageObjectRule = new awsnative.events.Rule(
	prefixComponentName('DeleteIssuePageObjectRule'),
	{
		eventPattern: {
			source: ['aws.s3'],
			'detail-type': ['Object Deleted'],
			detail: {
				'bucket.name': [s3.bucket.name],
				'object.key': [{ wildcard: 'issues/*/pages/*.raw.jpg' }],
			},
		},
		targets: [
			{
				id: 'CleanUpIssuePageThumbnailQueueTarget',
				arn: cleanUpIssuePageThumbnailQueue.arn,
			},
		],
	},
);

new aws.sqs.QueuePolicy(
	prefixComponentName('CleanUpIssuePageThumbnailQueuePolicy'),
	{
		queueUrl: cleanUpIssuePageThumbnailQueue.url,
		policy: aws.iam.getPolicyDocumentOutput({
			statements: [
				{
					principals: [
						{ type: 'Service', identifiers: ['events.amazonaws.com'] },
					],
					actions: ['sqs:SendMessage'],
					resources: [cleanUpIssuePageThumbnailQueue.arn],
					conditions: [
						{
							test: 'ArnEquals',
							variable: 'aws:SourceArn',
							values: [deleteIssuePageObjectRule.arn],
						},
					],
				},
			],
		}).json,
	},
);
