import { Resource } from 'sst';

import { eventSchema } from './event';

import { getIssueItemByIdFromTable } from '@cbx-weekly/backend-comicbook-dynamodb';

import { createApiGateway } from '@cbx-weekly/backend-core-functions';

import { handleItemNotFoundError } from '@cbx-weekly/backend-core-dynamodb';

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

import { NotFound } from 'http-errors';

const dynamodbClient = new DynamoDBClient();

export const main = createApiGateway(eventSchema).eventHandler(
	async (event) => {
		const { item } = await getIssueItemByIdFromTable(
			{
				id: event.pathParameters.issueId,
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
				issue: item,
			},
		};
	},
);
