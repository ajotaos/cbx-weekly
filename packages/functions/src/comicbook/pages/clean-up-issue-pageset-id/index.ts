import { Resource } from 'sst';

import { recordSchema } from './record';

import { Comicbook } from '@cbx-weekly/core/comicbook';

import { Lambda } from '@cbx-weekly/utils/lambda';

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

const dynamodbClient = new DynamoDBClient();

export const main = Lambda.makeSqs(recordSchema).recordHandler(
	async (record) => {
		const { oldImage: oldIssue, newImage: newIssue } = record.body.dynamodb;

		if (
			newIssue.pagesetId === undefined ||
			oldIssue.pagesetId !== newIssue.pagesetId
		) {
			await Comicbook.Dynamodb.deleteIssuePagesetId(
				{
					issueId: oldIssue.id,
					pagesetId: oldIssue.pagesetId,
				},
				Resource.ComicbookDynamodbTable.name,
				dynamodbClient,
			);
		}
	},
);
