import { Resource } from 'sst';

import { recordSchema } from './record';

import { Comicbook } from '@cbx-weekly/core/comicbook';

import { Lambda } from '@cbx-weekly/utils/lambda';

import { S3Client } from '@aws-sdk/client-s3';

const s3Client = new S3Client();

export const main = Lambda.makeSqs(recordSchema).recordHandler(
	async (record) => {
		const { oldImage: oldPageset } = record.body.dynamodb;

		await Comicbook.S3.deletePagesetContents(
			{ pagesetId: oldPageset.id },
			Resource.ComicbookS3Bucket.name,
			s3Client,
		);
	},
);
