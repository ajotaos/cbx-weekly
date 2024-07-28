import { Resource } from 'sst';

import { eventSchema } from './event';

import { queryIssueItemsBySeriesFromTable } from '@cbx-weekly/backend-comicbook-dynamodb';

import { createApiGateway } from '@cbx-weekly/backend-core-functions';

import {
	createSignedPaginationCursor,
	extractSignedPaginationCursor,
} from '../utils/pagination';

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

const dynamodbClient = new DynamoDBClient();

export const main = createApiGateway(eventSchema).eventHandler(
	async (event) => {
		const { items, cursor } = await queryIssueItemsBySeriesFromTable(
			{
				seriesId: event.pathParameters.seriesId,
				cursor: extractSignedPaginationCursor(
					event.queryStringParameters.cursor,
					Resource.ComicbookSecretsListIssuesBySeriesCursorSecret.value,
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
				issues: items,
				cursor: createSignedPaginationCursor(
					cursor,
					Resource.ComicbookSecretsListIssuesBySeriesCursorSecret.value,
				),
			},
		};
	},
);

function ifDefined<T, U>(transform: (value: T) => U) {
	return (value: T | undefined) => {
		if (value === undefined) {
			return;
		}

		return transform(value);
	};
}
