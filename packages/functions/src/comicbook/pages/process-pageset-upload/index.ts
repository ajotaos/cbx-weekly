import { Resource } from 'sst';

import { recordSchema } from './record';

import { Comicbook } from '@cbx-weekly/core/comicbook';

import { Lambda } from '@cbx-weekly/utils/lambda';

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { S3Client } from '@aws-sdk/client-s3';

import { minutesToSeconds } from 'date-fns';

const dynamodbClient = new DynamoDBClient();
const s3Client = new S3Client();

export const main = Lambda.makeSqsFifo(recordSchema).recordHandler(
	async (record) => {
		const { pagesetId } = record.body.detail.object.key;

		try {
			await Comicbook.Dynamodb.updatePagesetStatus(
				{
					id: pagesetId,
					status: 'processing',
					expiration: (currentTime) => currentTime + minutesToSeconds(3),
				},
				Resource.ComicbookDynamodbTable.name,
				dynamodbClient,
			);

			const { object: pagesetUploadObject } =
				await Comicbook.S3.getPagesetUpload(
					{
						pagesetId,
					},
					Resource.ComicbookS3Bucket.name,
					s3Client,
				);

			const pagesetUpload = await pagesetUploadObject.body();

			const pagesetArchive = await Comicbook.Artifacts.createPagesetArchive(
				pagesetUpload,
				async (pagesetPage, number) => {
					await Comicbook.S3.putPagesetPage(
						pagesetPage,
						{ number, pagesetId },
						Resource.ComicbookS3Bucket.name,
						s3Client,
					);
				},
			);

			await Comicbook.S3.putPagesetArchive(
				pagesetArchive,
				{ pagesetId },
				Resource.ComicbookS3Bucket.name,
				s3Client,
			);

			await Comicbook.Dynamodb.updatePagesetStatus(
				{
					id: pagesetId,
					status: 'ready',
				},
				Resource.ComicbookDynamodbTable.name,
				dynamodbClient,
			);
		} catch (error) {
			await Comicbook.Dynamodb.updatePagesetStatus(
				{
					id: pagesetId,
					status: 'failed',
					expiration: (currentTime) => currentTime + minutesToSeconds(30),
				},
				Resource.ComicbookDynamodbTable.name,
				dynamodbClient,
			);

			throw error;
		}

		await Comicbook.S3.deletePagesetUpload(
			{
				pagesetId,
			},
			Resource.ComicbookS3Bucket.name,
			s3Client,
		);
	},
);
