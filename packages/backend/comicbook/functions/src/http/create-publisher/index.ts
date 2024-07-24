import { environment } from './types/env';
import { eventSchema } from './types/event';

import { putPublisherItemInTable } from '@cbx-weekly/backend-comicbook-dynamodb';

import { makeApiGateway } from '@cbx-weekly/backend-core-functions';

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

const dynamodbClient = new DynamoDBClient({ region: environment.AWS_REGION });

export const main = makeApiGateway(eventSchema).handler(async (event) => {
	const { item } = await putPublisherItemInTable(
		{
			title: event.body.title,
		},
		environment.DYNAMODB_TABLE_NAME,
		dynamodbClient,
	);

	return {
		statusCode: 200,
		body: {
			publisher: { id: item.id },
		},
	};
});
