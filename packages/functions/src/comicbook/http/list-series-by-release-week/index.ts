import { Resource } from 'sst';

import { eventSchema } from './event';

import { signCursor, verifyCursor } from './cursor';

import { Comicbook } from '@cbx-weekly/core/comicbook';

import { Lambda } from '@cbx-weekly/utils/lambda';

import { mapIfDefined } from '@cbx-weekly/utils/core';

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

const dynamodbClient = new DynamoDBClient();

export const main = Lambda.makeApiGateway(eventSchema).eventHandler(
	async (event) => {
		const { items, cursor } = await Comicbook.Dynamodb.querySeriesByReleaseWeek(
			{
				releaseWeek: event.queryStringParameters.releaseWeek,
				cursor: mapIfDefined(event.queryStringParameters.cursor, verifyCursor),
				order: event.queryStringParameters.order,
				limit: event.queryStringParameters.limit,
			},
			Resource.ComicbookDynamodbTable.name,
			dynamodbClient,
		);

		return {
			statusCode: 200,
			body: {
				results: items,
				cursor: mapIfDefined(cursor, signCursor),
			},
		};
	},
);
