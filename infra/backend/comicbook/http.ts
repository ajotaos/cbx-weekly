import * as dynamodb from './dynamodb';
import * as s3 from './s3';
import * as secrets from './secrets';

import { backendServicePaths } from '../utils/paths';

import { prefix } from '../../utils/prefix';

const prefixComponentName = prefix('ComicbookHttp');

const { makeLambdaFunctionHandlerPath } = backendServicePaths(
	'comicbook',
	'http',
);

export const publicApi = new sst.aws.ApiGatewayV2(
	prefixComponentName('PublicApi'),
);

publicApi.route('GET /publishers', {
	handler: makeLambdaFunctionHandlerPath('list-publishers'),
	permissions: [
		{
			actions: ['dynamodb:Query'],
			resources: [$interpolate`${dynamodb.table.arn}/index/Gsi2`],
		},
	],
	link: [dynamodb.table, secrets.comicbook.cursors.listPublishers],
});

publicApi.route('GET /publishers/{publisher_id}', {
	handler: makeLambdaFunctionHandlerPath('get-publisher-by-id'),
	permissions: [
		{ actions: ['dynamodb:GetItem'], resources: [dynamodb.table.arn] },
	],
	link: [dynamodb.table],
});

publicApi.route('GET /publishers/{publisher_id}/series', {
	handler: makeLambdaFunctionHandlerPath('list-series-by-publisher'),
	permissions: [
		{
			actions: ['dynamodb:Query'],
			resources: [$interpolate`${dynamodb.table.arn}/index/Gsi2`],
		},
	],
	link: [dynamodb.table, secrets.comicbook.cursors.listSeriesByPublisher],
});

publicApi.route('GET /series/{series_id}', {
	handler: makeLambdaFunctionHandlerPath('get-series-by-id'),
	permissions: [
		{ actions: ['dynamodb:GetItem'], resources: [dynamodb.table.arn] },
	],
	link: [dynamodb.table],
});

publicApi.route('GET /series/{series_id}/issues', {
	handler: makeLambdaFunctionHandlerPath('list-issues-by-series'),
	permissions: [
		{
			actions: ['dynamodb:Query'],
			resources: [$interpolate`${dynamodb.table.arn}/index/Gsi2`],
		},
	],
	link: [dynamodb.table, secrets.comicbook.cursors.listIssuesBySeries],
});

publicApi.route('GET /issues/{issue_id}', {
	handler: makeLambdaFunctionHandlerPath('get-issue-by-id'),
	permissions: [
		{ actions: ['dynamodb:GetItem'], resources: [dynamodb.table.arn] },
	],
	link: [dynamodb.table],
});

export const privateApi = new sst.aws.ApiGatewayV2(
	prefixComponentName('PrivateApi'),
);

privateApi.route('POST /publishers', {
	handler: makeLambdaFunctionHandlerPath('create-publisher'),
	permissions: [
		{ actions: ['dynamodb:PutItem'], resources: [dynamodb.table.arn] },
	],
	link: [dynamodb.table],
});

privateApi.route('POST /publishers/{publisher_id}/series', {
	handler: makeLambdaFunctionHandlerPath('create-series'),
	permissions: [
		{
			actions: ['dynamodb:ConditionCheckItem', 'dynamodb:PutItem'],
			resources: [dynamodb.table.arn],
		},
	],
	link: [dynamodb.table],
});

privateApi.route('POST /series/{series_id}/issues', {
	handler: makeLambdaFunctionHandlerPath('create-issue'),
	permissions: [
		{
			actions: ['dynamodb:ConditionCheckItem', 'dynamodb:PutItem'],
			resources: [dynamodb.table.arn],
		},
	],
	link: [dynamodb.table],
});

privateApi.route('POST /issues/{issue_id}/pages/upload', {
	handler: makeLambdaFunctionHandlerPath('sign-issue-pages-upload'),
	permissions: [
		{
			actions: ['s3:PutObject'],
			resources: [$interpolate`${s3.bucket.arn}/*`],
		},
	],
	link: [s3.bucket],
});
