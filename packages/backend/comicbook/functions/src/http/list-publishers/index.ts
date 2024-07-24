import { Resource } from 'sst';

import { eventSchema } from './event';

import { queryPublisherItemsFromTable } from '@cbx-weekly/backend-comicbook-dynamodb';

import { createApiGateway } from '@cbx-weekly/backend-core-functions';

import {
	createSignedPaginationCursor,
	extractSignedPaginationCursor,
} from '../utils/pagination';

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

const dynamodbClient = new DynamoDBClient();

export const main = createApiGateway(eventSchema).eventHandler(
	async (event) => {
		const { items, cursor } = await queryPublisherItemsFromTable(
			{
				cursor: extractSignedPaginationCursor(
					event.queryStringParameters.cursor,
					Resource.ComicbookSecretsListPublishersCursorSecret.value,
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
				publishers: items,
				cursor: createSignedPaginationCursor(
					cursor,
					Resource.ComicbookSecretsListPublishersCursorSecret.value,
				),
			},
		};
	},
);

function mapIfDefined<T, U>(
	value: T | undefined,
	fn: (value: T) => U,
): U | undefined {
	return value !== undefined ? fn(value) : undefined;
}
