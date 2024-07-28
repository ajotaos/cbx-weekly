import { Resource } from 'sst';

import { eventSchema } from './event';

import { putSeriesItemInTable } from '@cbx-weekly/backend-comicbook-dynamodb';

import { createApiGateway } from '@cbx-weekly/backend-core-functions';

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

const dynamodbClient = new DynamoDBClient();

export const main = createApiGateway(eventSchema).eventHandler(
	async (event) => {
		const { item } = await putSeriesItemInTable(
			{
				title: event.body.title,
				releaseDate: event.body.releaseDate,
				publisherId: event.pathParameters.publisherId,
			},
			Resource.ComicbookDynamodbTable.name,
			dynamodbClient,
		);

		return {
			statusCode: 200,
			body: {
				series: { id: item.id },
			},
		};
	},
);
