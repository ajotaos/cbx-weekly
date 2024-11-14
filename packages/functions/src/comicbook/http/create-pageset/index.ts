import { Resource } from 'sst';

import { eventSchema } from './event';

import { Comicbook } from '@cbx-weekly/core/comicbook';

import { Dynamodb } from '@cbx-weekly/utils/dynamodb';
import { Lambda } from '@cbx-weekly/utils/lambda';

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { S3Client } from '@aws-sdk/client-s3';

import { NotFound, UnprocessableEntity } from 'http-errors';

import { minutesToSeconds } from 'date-fns';

const dynamodbClient = new DynamoDBClient();
const s3Client = new S3Client();

export const main = Lambda.makeApiGateway(eventSchema).eventHandler(
	async (event) => {
		const { item } = await Comicbook.Dynamodb.putPageset(
			{
				issueId: event.body.issueId,
			},
			Resource.ComicbookDynamodbTable.name,
			dynamodbClient,
		)
			.catch(
				Dynamodb.Errors.itemNotFound.handle(() => {
					throw new NotFound();
				}),
			)
			.catch(
				Dynamodb.Errors.itemAlreadyExists.handle(() => {
					throw new UnprocessableEntity();
				}),
			);

		const upload = await Comicbook.S3.signPagesetUploadUrl(
			{
				pagesetId: item.id,
				expiresIn: minutesToSeconds(3),
			},
			Resource.ComicbookS3Bucket.name,
			s3Client,
		);

		await Comicbook.Dynamodb.updatePagesetStatus(
			{
				id: item.id,
				status: 'pending',
				expiration: upload.expiration,
			},
			Resource.ComicbookDynamodbTable.name,
			dynamodbClient,
		).catch(
			Dynamodb.Errors.itemNotFound.handle(() => {
				throw new NotFound();
			}),
		);

		return {
			statusCode: 201,
			body: {
				result: { id: item.id },
				upload: { url: upload.url },
			},
		};
	},
);
