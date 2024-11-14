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

// api.route('GET /publishers/by-id/{publisher_id}', {
// 	handler: makeFunctionHandlerPath('get-publisher-by-id'),
// 	permissions: [
// 		{ actions: ['dynamodb:GetItem'], resources: [dynamodb.table.arn] },
// 	],
// 	link: [dynamodb.table],
// });

// api.route('GET /publishers/by-slug/{publisher_slug}', {
// 	handler: makeFunctionHandlerPath('get-publisher-by-slug'),
// 	permissions: [
// 		{
// 			actions: ['dynamodb:Query'],
// 			resources: [$interpolate`${dynamodb.table.arn}/index/Gsi1`],
// 		},
// 	],
// 	link: [dynamodb.table],
// });

// api.route('GET /publishers/by-title/{publisher_title}', {
// 	handler: makeFunctionHandlerPath('get-publisher-by-title'),
// 	permissions: [
// 		{
// 			actions: ['dynamodb:Query'],
// 			resources: [$interpolate`${dynamodb.table.arn}/index/Gsi1`],
// 		},
// 	],
// 	link: [dynamodb.table],
// });

// api.route('POST /publishers', {
// 	handler: makeFunctionHandlerPath('create-publisher'),
// 	permissions: [
// 		{ actions: ['dynamodb:PutItem'], resources: [dynamodb.table.arn] },
// 	],
// 	link: [dynamodb.table],
// });

// const listSeriesByPublisherIdCursorSecret = new sst.Secret(
// 	prefixComponentName('ApiListSeriesByPublisherIdCursorSecret'),
// );

// api.route('GET /publishers/by-id/{publisher_id}/series', {
// 	handler: makeFunctionHandlerPath('list-series-by-publisher-id'),
// 	permissions: [
// 		{
// 			actions: ['dynamodb:Query'],
// 			resources: [$interpolate`${dynamodb.table.arn}/index/Gsi2`],
// 		},
// 	],
// 	link: [dynamodb.table, listSeriesByPublisherIdCursorSecret],
// });

// const listSeriesByReleaseWeekCursorSecret = new sst.Secret(
// 	prefixComponentName('ApiListSeriesByReleaseWeekCursorSecret'),
// );

// api.route('GET /releases/by-week/{release_week}/series', {
// 	handler: makeFunctionHandlerPath('list-series-by-release-week'),
// 	permissions: [
// 		{
// 			actions: ['dynamodb:Query'],
// 			resources: [$interpolate`${dynamodb.table.arn}/index/Gsi3`],
// 		},
// 	],
// 	link: [dynamodb.table, listSeriesByReleaseWeekCursorSecret],
// });

// api.route('GET /series/by-id/{series_id}', {
// 	handler: makeFunctionHandlerPath('get-series-by-id'),
// 	permissions: [
// 		{ actions: ['dynamodb:GetItem'], resources: [dynamodb.table.arn] },
// 	],
// 	link: [dynamodb.table],
// });

// api.route('GET /series/by-slug/{series_slug}', {
// 	handler: makeFunctionHandlerPath('get-series-by-slug'),
// 	permissions: [
// 		{
// 			actions: ['dynamodb:Query'],
// 			resources: [$interpolate`${dynamodb.table.arn}/index/Gsi1`],
// 		},
// 	],
// 	link: [dynamodb.table],
// });

// api.route('GET /series/by-title/{series_title}', {
// 	handler: makeFunctionHandlerPath('get-series-by-title'),
// 	permissions: [
// 		{
// 			actions: ['dynamodb:Query'],
// 			resources: [$interpolate`${dynamodb.table.arn}/index/Gsi1`],
// 		},
// 	],
// 	link: [dynamodb.table],
// });

// api.route('POST /series', {
// 	handler: makeFunctionHandlerPath('create-series'),
// 	permissions: [
// 		{
// 			actions: ['dynamodb:ConditionCheckItem', 'dynamodb:PutItem'],
// 			resources: [dynamodb.table.arn],
// 		},
// 	],
// 	link: [dynamodb.table],
// });

// const listIssuesBySeriesIdCursorSecret = new sst.Secret(
// 	prefixComponentName('ApiListIssuesBySeriesIdCursorSecret'),
// );

// api.route('GET /series/by-id/{series_id}/issues', {
// 	handler: makeFunctionHandlerPath('list-issues-by-series-id'),
// 	permissions: [
// 		{
// 			actions: ['dynamodb:Query'],
// 			resources: [$interpolate`${dynamodb.table.arn}/index/Gsi2`],
// 		},
// 	],
// 	link: [dynamodb.table, listIssuesBySeriesIdCursorSecret],
// });

// const listIssuesByReleaseWeekCursorSecret = new sst.Secret(
// 	prefixComponentName('ApiListIssuesByReleaseWeekCursorSecret'),
// );

// api.route('GET /releases/by-week/{release_week}/issues', {
// 	handler: makeFunctionHandlerPath('list-issues-by-release-week'),
// 	permissions: [
// 		{
// 			actions: ['dynamodb:Query'],
// 			resources: [$interpolate`${dynamodb.table.arn}/index/Gsi3`],
// 		},
// 	],
// 	link: [dynamodb.table, listIssuesByReleaseWeekCursorSecret],
// });

// api.route('GET /issues/by-id/{issue_id}', {
// 	handler: makeFunctionHandlerPath('get-issue-by-id'),
// 	permissions: [
// 		{ actions: ['dynamodb:GetItem'], resources: [dynamodb.table.arn] },
// 	],
// 	link: [dynamodb.table],
// });

// api.route('GET /issues/by-slug/{issue_slug}', {
// 	handler: makeFunctionHandlerPath('get-issue-by-slug'),
// 	permissions: [
// 		{
// 			actions: ['dynamodb:Query'],
// 			resources: [$interpolate`${dynamodb.table.arn}/index/Gsi1`],
// 		},
// 	],
// 	link: [dynamodb.table],
// });

// api.route('GET /issues/by-title/{publisher_name}/{series_name}/{issue_number}', {
// 	handler: makeFunctionHandlerPath('get-issue-by-title'),
// 	permissions: [
// 		{
// 			actions: ['dynamodb:Query'],
// 			resources: [$interpolate`${dynamodb.table.arn}/index/Gsi1`],
// 		},
// 	],
// 	link: [dynamodb.table],
// });

// api.route('POST /issues', {
// 	handler: makeFunctionHandlerPath('create-issue'),
// 	permissions: [
// 		{
// 			actions: ['dynamodb:ConditionCheckItem', 'dynamodb:PutItem'],
// 			resources: [dynamodb.table.arn],
// 		},
// 	],
// 	link: [dynamodb.table],
// });

// const listPagesetsByIssueIdCursorSecret = new sst.Secret(
// 	prefixComponentName('ApiListPagesetsByIssueIdCursorSecret'),
// );

// api.route('PATCH /issues/by-id/{issue_id}', {
// 	handler: makeFunctionHandlerPath('update-issue'),
// 	permissions: [
// 		{
// 			actions: [
// 				'dynamodb:ConditionCheckItem',
// 				'dynamodb:PutItem',
// 				'dynamodb:UpdateItem',
// 			],
// 			resources: [dynamodb.table.arn],
// 		},
// 	],
// 	link: [dynamodb.table],
// });

// api.route('GET /issues/by-id/{issue_id}/pagesets', {
// 	handler: makeFunctionHandlerPath('list-pagesets-by-issue-id'),
// 	permissions: [
// 		{
// 			actions: ['dynamodb:Query'],
// 			resources: [$interpolate`${dynamodb.table.arn}/index/Gsi1`],
// 		},
// 	],
// 	link: [dynamodb.table, listPagesetsByIssueIdCursorSecret],
// });

// api.route('GET /pagesets/by-id/{pageset_id}', {
// 	handler: makeFunctionHandlerPath('get-pageset-by-id'),
// 	permissions: [
// 		{ actions: ['dynamodb:GetItem'], resources: [dynamodb.table.arn] },
// 	],
// 	link: [dynamodb.table],
// });

// api.route('POST /pagesets', {
// 	handler: makeFunctionHandlerPath('create-pageset'),
// 	permissions: [
// 		{
// 			actions: [
// 				'dynamodb:ConditionCheckItem',
// 				'dynamodb:PutItem',
// 				'dynamodb:UpdateItem',
// 			],
// 			resources: [dynamodb.table.arn],
// 		},
// 		{
// 			actions: ['s3:PutObject'],
// 			resources: [$interpolate`${s3.bucket.arn}/*`],
// 		},
// 	],
// 	link: [dynamodb.table, s3.bucket],
// });

// api.route('DELETE /pagesets/by-id/{pageset_id}', {
// 	handler: makeFunctionHandlerPath('delete-pageset'),
// 	permissions: [
// 		{
// 			actions: ['dynamodb:ConditionCheckItem', 'dynamodb:DeleteItem'],
// 			resources: [dynamodb.table.arn],
// 		},
// 	],
// 	link: [dynamodb.table],
// });

// GET /list-publishers

// GET /get-publisher/by-id?id=01jehha299bbrkggfzemetcvmg
// GET /get-publisher/by-slug?slug=marvel
// GET /get-publisher/by-title?name=Marvel

// GET /list-series/by-publisher-id?publisher-id=01jehha299bbrkggfzemetcvmg
// GET /list-series/by-release-week?release-week=2018-W18

// GET /get-series/by-id?id=01jehhdj3jkzvdpetqv3n4wqx8
// GET /get-series/by-slug?slug=marvel-avengers-2018
// GET /get-series/by-title?publisher=Marvel&name=Avengers (2018)

// GET /list-issues/by-series-id?series-id=01jehhdj3jkzvdpetqv3n4wqx8
// GET /list-issues/by-release-week?release-week=2018-W18

// GET /get-issue/by-id?id=01jehm2eb81e8v798b2q5eq2bm
// GET /get-issue/by-slug?slug=marvel-avengers-2018-0001
// GET /get-issue/by-title?publisher=Marvel&series=Avengers (2018)&number=1

// GET /list-pagesets/by-issue-id?issue-id=01jehm2eb81e8v798b2q5eq2bm

// GET /get-pageset/by-id?id=01jehm2fj5kap4ymmrv4fm9ej1

// POST /create-publisher

// POST /create-series

// POST /create-issue
// POST /update-issue/pageset-id

// POST /create-pageset
// POST /delete-pageset
