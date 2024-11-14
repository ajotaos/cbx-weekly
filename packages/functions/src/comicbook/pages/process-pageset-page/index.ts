import { Resource } from 'sst';

import { recordSchema } from './record';

import { Comicbook } from '@cbx-weekly/core/comicbook';

import { Lambda } from '@cbx-weekly/utils/lambda';

import { S3Client } from '@aws-sdk/client-s3';

const s3Client = new S3Client();

export const main = Lambda.makeSqs(recordSchema).recordHandler(
	async (record) => {
		const { number, pagesetId } = record.body.detail.object.key;

		const { object: pagesetPageObject } = await Comicbook.S3.getPagesetPage(
			{
				number,
				pagesetId,
			},
			Resource.ComicbookS3Bucket.name,
			s3Client,
		);

		const pagesetPage = await pagesetPageObject.body();

		const pagesetPageThumbnail =
			await Comicbook.Artifacts.createPagesetPageThumbnail(pagesetPage);

		await Comicbook.S3.putPagesetPageThumbnail(
			pagesetPageThumbnail,
			{
				number,
				pagesetId,
			},
			Resource.ComicbookS3Bucket.name,
			s3Client,
		);
	},
);
