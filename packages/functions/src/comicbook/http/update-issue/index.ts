import { Resource } from 'sst';

import { eventSchema } from './event';

import { Comicbook } from '@cbx-weekly/core/comicbook';

import { Dynamodb } from '@cbx-weekly/utils/dynamodb';
import { Lambda } from '@cbx-weekly/utils/lambda';

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

import { NotFound, UnprocessableEntity } from 'http-errors';

import type * as v from '@cbx-weekly/valibot/core';

import type { Context } from 'aws-lambda';

const dynamodbClient = new DynamoDBClient();

export const main = Lambda.makeApiGateway(eventSchema).eventHandler(
	(event, context) => updates[event.body.type](event, context),
);

const updates = {
	async 'pageset-id'(event: v.InferOutput<typeof eventSchema>, _: Context) {
		await Comicbook.Dynamodb.updateIssuePagesetId(
			{
				id: event.pathParameters.issueId,
				pagesetId: event.body.pagesetId,
			},
			Resource.ComicbookDynamodbTable.name,
			dynamodbClient,
		)
			.catch(
				Dynamodb.Errors.itemNotFound.handle(() => {
					throw new NotFound();
				}),
			)
			.catch(
				Dynamodb.Errors.itemAlreadyExists.handle(() => {
					throw new UnprocessableEntity();
				}),
			);

		return {
			statusCode: 204,
			body: null,
		};
	},
} as const;
