import * as dynamodb from './dynamodb';
import * as events from './events';
import * as s3 from './s3';

import { prefix, servicePaths } from '../utils';

const prefixComponentName = prefix('ComicbookPages');

const { makeFunctionHandlerPath } = servicePaths('comicbook', 'pages');

const extractPagesetUploadKeyComponentsQueueDlq = new sst.aws.Queue(
	prefixComponentName('ExtractPagesetUploadKeyComponentsQueueDlq'),
);

const extractPagesetUploadKeyComponentsQueue = new sst.aws.Queue(
	prefixComponentName('ExtractPagesetUploadKeyComponentsQueue'),
	{
		dlq: {
			queue: extractPagesetUploadKeyComponentsQueueDlq.arn,
			retry: 1,
		},
	},
);

sst.aws.Bus.subscribeQueue(
	prefixComponentName('PutPagesetUploadSubscription'),
	events.defaultBus.arn,
	extractPagesetUploadKeyComponentsQueue,
	{
		pattern: {
			source: ['aws.s3'],
			detailType: ['Object Created'],
			detail: {
				'bucket.name': [s3.bucket.name],
				'object.key': [{ wildcard: 'pagesets/*/upload.zip' }],
			},
		},
	},
);

const extractPagesetUploadKeyComponentsFunction = new sst.aws.Function(
	prefixComponentName('ExtractPagesetUploadKeyComponentsFunction'),
	{
		handler: makeFunctionHandlerPath('extract-pageset-upload-key-components'),
	},
);

const processPagesetUploadQueueDlq = new sst.aws.Queue(
	prefixComponentName('ProcessPagesetUploadQueueDlq'),
	{
		fifo: true,
	},
);

const processPagesetUploadQueue = new sst.aws.Queue(
	prefixComponentName('ProcessPagesetUploadQueue'),
	{
		fifo: true,
		visibilityTimeout: '5 minutes',
		dlq: {
			queue: processPagesetUploadQueueDlq.arn,
			retry: 1,
		},
		transform: {
			queue: {
				deduplicationScope: 'messageGroup',
				fifoThroughputLimit: 'perMessageGroupId',
			},
		},
	},
);

const processPagesetUploadPipeRole = new aws.iam.Role(
	prefixComponentName('ProcessPagesetUploadPipeRole'),
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
								'sqs:ReceiveMessage',
								'sqs:DeleteMessage',
								'sqs:GetQueueAttributes',
							],
							resources: [extractPagesetUploadKeyComponentsQueue.arn],
						},
						{
							actions: ['lambda:InvokeFunction'],
							resources: [extractPagesetUploadKeyComponentsFunction.arn],
						},
						{
							actions: ['sqs:SendMessage'],
							resources: [processPagesetUploadQueue.arn],
						},
					],
				}).json,
			},
		],
	},
);

new aws.pipes.Pipe(prefixComponentName('ProcessPagesetUploadPipe'), {
	roleArn: processPagesetUploadPipeRole.arn,
	source: extractPagesetUploadKeyComponentsQueue.arn,
	enrichment: extractPagesetUploadKeyComponentsFunction.arn,
	target: processPagesetUploadQueue.arn,
	targetParameters: {
		sqsQueueParameters: {
			messageGroupId: '$.detail.object.key.pagesetId',
			messageDeduplicationId: '$.detail.object.key.pagesetId',
		},
	},
});

processPagesetUploadQueue.subscribe(
	{
		handler: makeFunctionHandlerPath('process-pageset-upload'),
		nodejs: {
			install: ['sharp'],
		},
		permissions: [
			{ actions: ['dynamodb:UpdateItem'], resources: [dynamodb.table.arn] },
			{
				actions: ['s3:GetObject', 's3:PutObject', 's3:DeleteObject'],
				resources: [$interpolate`${s3.bucket.arn}/*`],
			},
		],
		link: [dynamodb.table, s3.bucket],
		timeout: '3 minutes',
	},
	{
		batch: {
			size: 3,
			partialResponses: true,
		},
	},
);

const processPagesetPageQueueDlq = new sst.aws.Queue(
	prefixComponentName('ProcessPagesetPageQueueDlq'),
);

const processPagesetPageQueue = new sst.aws.Queue(
	prefixComponentName('ProcessPagesetPageQueue'),
	{
		dlq: {
			queue: processPagesetPageQueueDlq.arn,
			retry: 1,
		},
	},
);

sst.aws.Bus.subscribeQueue(
	prefixComponentName('PutPagesetPageSubscription'),
	events.defaultBus.arn,
	processPagesetPageQueue,
	{
		pattern: {
			source: ['aws.s3'],
			detailType: ['Object Created'],
			detail: {
				'bucket.name': [s3.bucket.name],
				'object.key': [{ wildcard: 'pagesets/*/pages/*.raw.jpg' }],
			},
		},
	},
);

processPagesetPageQueue.subscribe(
	{
		handler: makeFunctionHandlerPath('process-pageset-page'),
		nodejs: {
			install: ['sharp'],
		},
		permissions: [
			{
				actions: ['s3:GetObject', 's3:PutObject'],
				resources: [$interpolate`${s3.bucket.arn}/*`],
			},
		],
		link: [s3.bucket],
	},
	{
		batch: {
			size: 5,
			partialResponses: true,
		},
	},
);

const cleanUpIssuePagesetIdQueueDlq = new sst.aws.Queue(
	prefixComponentName('CleanUpIssuePagesetIdQueueDlq'),
);

const cleanUpIssuePagesetIdQueue = new sst.aws.Queue(
	prefixComponentName('CleanUpIssuePagesetIdQueue'),
	{
		dlq: {
			queue: cleanUpIssuePagesetIdQueueDlq.arn,
			retry: 1,
		},
	},
);

const cleanUpIssuePagesetIdPipeRole = new aws.iam.Role(
	prefixComponentName('CleanUpIssuePagesetIdPipeRole'),
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
							resources: [cleanUpIssuePagesetIdQueue.arn],
						},
					],
				}).json,
			},
		],
	},
);

new aws.pipes.Pipe(prefixComponentName('CleanUpIssuePagesetIdPipe'), {
	roleArn: cleanUpIssuePagesetIdPipeRole.arn,
	source: dynamodb.table.nodes.table.streamArn,
	sourceParameters: {
		dynamodbStreamParameters: {
			startingPosition: 'TRIM_HORIZON',
			maximumRecordAgeInSeconds: 60,
			maximumBatchingWindowInSeconds: 10,
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
											prefix: 'issue:id:',
										},
									],
								},
								LatestUpdate: {
									M: {
										Type: {
											S: ['pageset-id'],
										},
									},
								},
							},
							OldImage: {
								PagesetId: {
									S: [{ exists: true }],
								},
							},
						},
					}),
				},
			],
		},
	},
	target: cleanUpIssuePagesetIdQueue.arn,
});

cleanUpIssuePagesetIdQueue.subscribe(
	{
		handler: makeFunctionHandlerPath('clean-up-issue-pageset-id'),
		permissions: [
			{
				actions: ['dynamodb:ConditionCheckItem', 'dynamodb:DeleteItem'],
				resources: [dynamodb.table.arn],
			},
		],
		link: [dynamodb.table],
	},
	{
		batch: {
			size: 5,
			partialResponses: true,
		},
	},
);

const cleanUpPagesetContentsQueueDlq = new sst.aws.Queue(
	prefixComponentName('CleanUpPagesetContentsQueueDlq'),
);

const cleanUpPagesetContentsQueue = new sst.aws.Queue(
	prefixComponentName('CleanUpPagesetContentsQueue'),
	{
		dlq: {
			queue: cleanUpPagesetContentsQueueDlq.arn,
			retry: 1,
		},
	},
);

const cleanUpPagesetContentsPipeRole = new aws.iam.Role(
	prefixComponentName('CleanUpPagesetContentsPipeRole'),
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
							resources: [cleanUpPagesetContentsQueue.arn],
						},
					],
				}).json,
			},
		],
	},
);

new aws.pipes.Pipe(prefixComponentName('CleanUpPagesetContentsPipe'), {
	roleArn: cleanUpPagesetContentsPipeRole.arn,
	source: dynamodb.table.nodes.table.streamArn,
	sourceParameters: {
		dynamodbStreamParameters: {
			startingPosition: 'TRIM_HORIZON',
			maximumRecordAgeInSeconds: 60,
			maximumBatchingWindowInSeconds: 10,
		},
		filterCriteria: {
			filters: [
				{
					pattern: $jsonStringify({
						eventName: ['REMOVE'],
						dynamodb: {
							OldImage: {
								Pk: {
									S: [
										{
											prefix: 'pageset:id:',
										},
									],
								},
							},
						},
					}),
				},
			],
		},
	},
	target: cleanUpPagesetContentsQueue.arn,
});

cleanUpPagesetContentsQueue.subscribe(
	{
		handler: makeFunctionHandlerPath('clean-up-pageset-contents'),
		permissions: [
			{
				actions: ['s3:ListBucket'],
				resources: [s3.bucket.arn],
			},
			{
				actions: ['s3:DeleteObject'],
				resources: [$interpolate`${s3.bucket.arn}/*`],
			},
		],
		link: [s3.bucket],
	},
	{
		batch: {
			size: 5,
			partialResponses: true,
		},
	},
);
