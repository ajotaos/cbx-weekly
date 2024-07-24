import { environment } from './types/env';
import { eventSchema } from './types/event';

import { putIssueItemInTable } from '@cbx-weekly/backend-comicbook-dynamodb';

import { makeApiGateway } from '@cbx-weekly/backend-core-functions';

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

const dynamodbClient = new DynamoDBClient({ region: environment.AWS_REGION });

export const main = makeApiGateway(eventSchema).handler(async (event) => {
	const { item } = await putIssueItemInTable(
		{
			title: event.body.title,
			seriesId: event.body.seriesId,
			releaseDate: event.body.releaseDate,
		},
		environment.DYNAMODB_TABLE_NAME,
		dynamodbClient,
	);

	return {
		statusCode: 200,
		body: {
			issue: { id: item.id },
		},
	};
});
