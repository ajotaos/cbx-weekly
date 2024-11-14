import { Resource } from 'sst';

import { eventSchema } from './event';

import { Comicbook } from '@cbx-weekly/core/comicbook';

import { Dynamodb } from '@cbx-weekly/utils/dynamodb';
import { Lambda } from '@cbx-weekly/utils/lambda';

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

import { NotFound } from 'http-errors';

const dynamodbClient = new DynamoDBClient();

export const main = Lambda.makeApiGateway(eventSchema).eventHandler(
	async (event) => {
		const { item } = await Comicbook.Dynamodb.getIssueByTitle(
			{
				title: {
					publisher: event.queryStringParameters.publisher,
					series: event.queryStringParameters.series,
					number: event.queryStringParameters.number,
				},
			},
			Resource.ComicbookDynamodbTable.name,
			dynamodbClient,
		).catch(
			Dynamodb.Errors.itemNotFound.handle(() => {
				throw new NotFound();
			}),
		);

		return {
			statusCode: 200,
			body: {
				result: item,
			},
		};
	},
);
