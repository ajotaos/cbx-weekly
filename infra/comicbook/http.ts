import * as dynamodb from './dynamodb';
import * as idempotency from './idempotency';
import * as s3 from './s3';

import { makeFunctionHandlerPathFactory } from '../utils/paths';
import { prefixComponentNameFactory } from '../utils/prefix';

const prefixComponentName = prefixComponentNameFactory('ComicbookHttp');
const makeFunctionHandlerPath = makeFunctionHandlerPathFactory(
	'comicbook',
	'http',
);

export const privateApi = new sst.aws.ApiGatewayV2(
	prefixComponentName('Private'),
);

privateApi.route('POST /create-publisher', {
	handler: makeFunctionHandlerPath('create-publisher'),
	environment: {
		DYNAMODB_TABLE_NAME: dynamodb.table.name,
	},
	permissions: [
		{ actions: ['dynamodb:PutItem'], resources: [dynamodb.table.arn] },
	],
});

privateApi.route('POST /create-series', {
	handler: makeFunctionHandlerPath('create-series'),
	environment: {
		DYNAMODB_TABLE_NAME: dynamodb.table.name,
	},
	permissions: [
		{
			actions: ['dynamodb:ConditionCheckItem', 'dynamodb:PutItem'],
			resources: [dynamodb.table.arn],
		},
	],
});

privateApi.route('POST /create-issue', {
	handler: makeFunctionHandlerPath('create-issue'),
	environment: {
		DYNAMODB_TABLE_NAME: dynamodb.table.name,
	},
	permissions: [
		{
			actions: ['dynamodb:ConditionCheckItem', 'dynamodb:PutItem'],
			resources: [dynamodb.table.arn],
		},
	],
});

privateApi.route('POST /sign-issue-pages-upload', {
	handler: makeFunctionHandlerPath('sign-issue-pages-upload'),
	environment: {
		S3_BUCKET_NAME: s3.bucket.name,
		IDEMPOTENCY_TABLE_NAME: idempotency.table.name,
	},
	permissions: [
		{
			actions: ['s3:PutObject'],
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
	],
});
