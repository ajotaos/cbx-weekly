import { Resource } from 'sst';

import { eventSchema } from './event';

import { Comicbook } from '@cbx-weekly/core/comicbook';

import { Dynamodb } from '@cbx-weekly/utils/dynamodb';
import { Lambda } from '@cbx-weekly/utils/lambda';

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

import { UnprocessableEntity } from 'http-errors';

const dynamodbClient = new DynamoDBClient();

export const main = Lambda.makeApiGateway(eventSchema).eventHandler(
	async (event) => {
		const { item } = await Comicbook.Dynamodb.putPublisher(
			{
				title: event.body.title,
			},
			Resource.ComicbookDynamodbTable.name,
			dynamodbClient,
		).catch(
			Dynamodb.Errors.itemAlreadyExists.handle(() => {
				throw new UnprocessableEntity();
			}),
		);

		return {
			statusCode: 201,
			body: {
				result: { id: item.id },
			},
		};
	},
);
