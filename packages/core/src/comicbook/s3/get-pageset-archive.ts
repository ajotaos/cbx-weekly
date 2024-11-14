import { makePagesetArchiveKey } from './keys/pageset-archive';
import { pagesetArchiveMetadataSchema } from './types/pageset-archive';

import { S3 } from '@cbx-weekly/utils/s3';

import type { S3Client } from '@aws-sdk/client-s3';

export async function getPagesetArchive(
	props: GetPagesetArchive.Props,
	bucketName: string,
	client: S3Client,
) {
	const key = makePagesetArchiveKey({ pagesetId: props.pagesetId });

	return S3.getObject(
		client,
		{
			bucketName,
			key,
		},
		pagesetArchiveMetadataSchema,
	).then((output) => {
		if (output.object === undefined) {
			throw S3.Errors.objectNotFound.make('pageset archive', {
				id: props.pagesetId,
			});
		}

		return { object: output.object };
	});
}

export declare namespace GetPagesetArchive {
	type Props = {
		pagesetId: string;
	};
}
