import { Resource } from 'sst';

import { eventSchema } from './event';

import { querySeriesItemsByPublisherFromTable } from '@cbx-weekly/backend-comicbook-dynamodb';

import { createApiGateway } from '@cbx-weekly/backend-core-functions';

import {
	createSignedPaginationCursor,
	extractSignedPaginationCursor,
} from '../utils/pagination';

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

const dynamodbClient = new DynamoDBClient();

export const main = createApiGateway(eventSchema).eventHandler(
	async (event) => {
		const { items, cursor } = await querySeriesItemsByPublisherFromTable(
			{
				publisherId: event.pathParameters.publisherId,
				cursor: extractSignedPaginationCursor(
					event.queryStringParameters.cursor,
					Resource.ComicbookSecretsListSeriesByPublisherCursorSecret.value,
				),
				order: event.queryStringParameters.order,
				limit: event.queryStringParameters.limit,
			},
			Resource.ComicbookDynamodbTable.name,
			dynamodbClient,
		);

		return {
			statusCode: 200,
			body: {
				series: items,
				cursor: createSignedPaginationCursor(
					cursor,
					Resource.ComicbookSecretsListSeriesByPublisherCursorSecret.value,
				),
			},
		};
	},
);
