import * as dynamodb from './dynamodb';
import * as s3 from './s3';

import { prefix, servicePaths } from '../utils';

const prefixComponentName = prefix('ComicbookHttp');

const { makeFunctionHandlerPath } = servicePaths('comicbook', 'http');

export const api = new sst.aws.ApiGatewayV2(prefixComponentName('Api'));

const listPublishersCursorSecret = new sst.Secret(
	prefixComponentName('ApiListPublishersCursorSecret'),
);

api.route('GET /list-publishers', {
	handler: makeFunctionHandlerPath('list-publishers'),
	permissions: [
		{
			actions: ['dynamodb:Query'],
			resources: [$interpolate`${dynamodb.table.arn}/index/Gsi2`],
		},
	],
	link: [dynamodb.table, listPublishersCursorSecret],
});

api.route('GET /get-publisher-by-id', {
	handler: makeFunctionHandlerPath('get-publisher-by-id'),
	permissions: [
		{ actions: ['dynamodb:GetItem'], resources: [dynamodb.table.arn] },
	],
	link: [dynamodb.table],
});

api.route('GET /get-publisher-by-slug', {
	handler: makeFunctionHandlerPath('get-publisher-by-slug'),
	permissions: [
		{
			actions: ['dynamodb:Query'],
			resources: [$interpolate`${dynamodb.table.arn}/index/Gsi1`],
		},
	],
	link: [dynamodb.table],
});

api.route('GET /get-publisher-by-title', {
	handler: makeFunctionHandlerPath('get-publisher-by-title'),
	permissions: [
		{
			actions: ['dynamodb:Query'],
			resources: [$interpolate`${dynamodb.table.arn}/index/Gsi1`],
		},
	],
	link: [dynamodb.table],
});

api.route('POST /create-publisher', {
	handler: makeFunctionHandlerPath('create-publisher'),
	permissions: [
		{ actions: ['dynamodb:PutItem'], resources: [dynamodb.table.arn] },
	],
	link: [dynamodb.table],
});

const listSeriesByPublisherIdCursorSecret = new sst.Secret(
	prefixComponentName('ApiListSeriesByPublisherIdCursorSecret'),
);

api.route('GET /list-series-by-publisher-id', {
	handler: makeFunctionHandlerPath('list-series-by-publisher-id'),
	permissions: [
		{
			actions: ['dynamodb:Query'],
			resources: [$interpolate`${dynamodb.table.arn}/index/Gsi2`],
		},
	],
	link: [dynamodb.table, listSeriesByPublisherIdCursorSecret],
});

const listSeriesByReleaseWeekCursorSecret = new sst.Secret(
	prefixComponentName('ApiListSeriesByReleaseWeekCursorSecret'),
);

api.route('GET /list-series-by-release-week', {
	handler: makeFunctionHandlerPath('list-series-by-release-week'),
	permissions: [
		{
			actions: ['dynamodb:Query'],
			resources: [$interpolate`${dynamodb.table.arn}/index/Gsi3`],
		},
	],
	link: [dynamodb.table, listSeriesByReleaseWeekCursorSecret],
});

api.route('GET /get-series-by-id', {
	handler: makeFunctionHandlerPath('get-series-by-id'),
	permissions: [
		{ actions: ['dynamodb:GetItem'], resources: [dynamodb.table.arn] },
	],
	link: [dynamodb.table],
});

api.route('GET /get-series-by-slug', {
	handler: makeFunctionHandlerPath('get-series-by-slug'),
	permissions: [
		{
			actions: ['dynamodb:Query'],
			resources: [$interpolate`${dynamodb.table.arn}/index/Gsi1`],
		},
	],
	link: [dynamodb.table],
});

api.route('GET /get-series-by-title', {
	handler: makeFunctionHandlerPath('get-series-by-title'),
	permissions: [
		{
			actions: ['dynamodb:Query'],
			resources: [$interpolate`${dynamodb.table.arn}/index/Gsi1`],
		},
	],
	link: [dynamodb.table],
});

api.route('POST /create-series', {
	handler: makeFunctionHandlerPath('create-series'),
	permissions: [
		{
			actions: ['dynamodb:ConditionCheckItem', 'dynamodb:PutItem'],
			resources: [dynamodb.table.arn],
		},
	],
	link: [dynamodb.table],
});

const listIssuesBySeriesIdCursorSecret = new sst.Secret(
	prefixComponentName('ApiListIssuesBySeriesIdCursorSecret'),
);

api.route('GET /list-issues-by-series-id', {
	handler: makeFunctionHandlerPath('list-issues-by-series-id'),
	permissions: [
		{
			actions: ['dynamodb:Query'],
			resources: [$interpolate`${dynamodb.table.arn}/index/Gsi2`],
		},
	],
	link: [dynamodb.table, listIssuesBySeriesIdCursorSecret],
});

const listIssuesByReleaseWeekCursorSecret = new sst.Secret(
	prefixComponentName('ApiListIssuesByReleaseWeekCursorSecret'),
);

api.route('GET /list-issues-by-release-week', {
	handler: makeFunctionHandlerPath('list-issues-by-release-week'),
	permissions: [
		{
			actions: ['dynamodb:Query'],
			resources: [$interpolate`${dynamodb.table.arn}/index/Gsi3`],
		},
	],
	link: [dynamodb.table, listIssuesByReleaseWeekCursorSecret],
});

api.route('GET /get-issue-by-id', {
	handler: makeFunctionHandlerPath('get-issue-by-id'),
	permissions: [
		{ actions: ['dynamodb:GetItem'], resources: [dynamodb.table.arn] },
	],
	link: [dynamodb.table],
});

api.route('GET /get-issue-by-slug', {
	handler: makeFunctionHandlerPath('get-issue-by-slug'),
	permissions: [
		{
			actions: ['dynamodb:Query'],
			resources: [$interpolate`${dynamodb.table.arn}/index/Gsi1`],
		},
	],
	link: [dynamodb.table],
});

api.route('GET /get-issue-by-title', {
	handler: makeFunctionHandlerPath('get-issue-by-title'),
	permissions: [
		{
			actions: ['dynamodb:Query'],
			resources: [$interpolate`${dynamodb.table.arn}/index/Gsi1`],
		},
	],
	link: [dynamodb.table],
});

api.route('POST /create-issue', {
	handler: makeFunctionHandlerPath('create-issue'),
	permissions: [
		{
			actions: ['dynamodb:ConditionCheckItem', 'dynamodb:PutItem'],
			resources: [dynamodb.table.arn],
		},
	],
	link: [dynamodb.table],
});

api.route('POST /update-issue-pageset-id', {
	handler: makeFunctionHandlerPath('update-issue-pageset-id'),
	permissions: [
		{
			actions: [
				'dynamodb:ConditionCheckItem',
				'dynamodb:PutItem',
				'dynamodb:UpdateItem',
			],
			resources: [dynamodb.table.arn],
		},
	],
	link: [dynamodb.table],
});

const listPagesetsByIssueIdCursorSecret = new sst.Secret(
	prefixComponentName('ApiListPagesetsByIssueIdCursorSecret'),
);

api.route('GET /list-pagesets-by-issue-id', {
	handler: makeFunctionHandlerPath('list-pagesets-by-issue-id'),
	permissions: [
		{
			actions: ['dynamodb:Query'],
			resources: [$interpolate`${dynamodb.table.arn}/index/Gsi1`],
		},
	],
	link: [dynamodb.table, listPagesetsByIssueIdCursorSecret],
});

api.route('GET /get-pageset-by-id', {
	handler: makeFunctionHandlerPath('get-pageset-by-id'),
	permissions: [
		{ actions: ['dynamodb:GetItem'], resources: [dynamodb.table.arn] },
	],
	link: [dynamodb.table],
});

api.route('POST /create-pageset', {
	handler: makeFunctionHandlerPath('create-pageset'),
	permissions: [
		{
			actions: [
				'dynamodb:ConditionCheckItem',
				'dynamodb:PutItem',
				'dynamodb:UpdateItem',
			],
			resources: [dynamodb.table.arn],
		},
		{
			actions: ['s3:PutObject'],
			resources: [$interpolate`${s3.bucket.arn}/*`],
		},
	],
	link: [dynamodb.table, s3.bucket],
});

api.route('POST /delete-pageset', {
	handler: makeFunctionHandlerPath('delete-pageset'),
	permissions: [
		{
			actions: ['dynamodb:ConditionCheckItem', 'dynamodb:DeleteItem'],
			resources: [dynamodb.table.arn],
		},
	],
	link: [dynamodb.table],
});
