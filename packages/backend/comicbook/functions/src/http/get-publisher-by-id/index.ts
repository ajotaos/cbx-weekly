import { Resource } from 'sst';

import { eventSchema } from './event';

import { getPublisherItemByIdFromTable } from '@cbx-weekly/backend-comicbook-dynamodb';

import { createApiGateway } from '@cbx-weekly/backend-core-functions';

import { handleItemNotFoundError } from '@cbx-weekly/backend-core-dynamodb';

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

import { NotFound } from 'http-errors';

const dynamodbClient = new DynamoDBClient();

export const main = createApiGateway(eventSchema).eventHandler(
	async (event) => {
		const { item } = await getPublisherItemByIdFromTable(
			{
				id: event.pathParameters.publisherId,
			},
			Resource.ComicbookDynamodbTable.name,
			dynamodbClient,
		).catch(
			handleItemNotFoundError(() => {
				throw new NotFound();
			}),
		);

		return {
			statusCode: 200,
			body: {
				publisher: item,
			},
		};
	},
);
