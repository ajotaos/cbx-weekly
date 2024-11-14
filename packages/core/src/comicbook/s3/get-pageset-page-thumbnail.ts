import { makePagesetPageThumbnailKey } from './keys/pageset-page-thumbnail';
import { pagesetPageThumbnailMetadataSchema } from './types/pageset-page-thumbnail';

import { S3 } from '@cbx-weekly/utils/s3';

import type { S3Client } from '@aws-sdk/client-s3';

export async function getPagesetPageThumbnail(
	props: GetPagesetPageThumbnail.Props,
	bucketName: string,
	client: S3Client,
) {
	const key = makePagesetPageThumbnailKey({
		number: props.number,
		pagesetId: props.pagesetId,
	});

	return S3.getObject(
		client,
		{
			bucketName,
			key,
		},
		pagesetPageThumbnailMetadataSchema,
	).then((output) => {
		if (output.object === undefined) {
			throw S3.Errors.objectNotFound.make('pageset page thumbnail', {
				id: props.pagesetId,
			});
		}

		return { object: output.object };
	});
}

export declare namespace GetPagesetPageThumbnail {
	type Props = {
		number: string;
		pagesetId: string;
	};
}
