import { makePagesetUploadKey } from './keys/pageset-upload';
import { pagesetUploadMetadataSchema } from './types/pageset-upload';

import { S3 } from '@cbx-weekly/utils/s3';

import type { S3Client } from '@aws-sdk/client-s3';

export async function getPagesetUpload(
	props: GetPagesetUpload.Props,
	bucketName: string,
	client: S3Client,
) {
	const key = makePagesetUploadKey({ pagesetId: props.pagesetId });

	return S3.getObject(
		client,
		{
			bucketName,
			key,
		},
		pagesetUploadMetadataSchema,
	).then((output) => {
		if (output.object === undefined) {
			throw S3.Errors.objectNotFound.make('pageset upload', {
				id: props.pagesetId,
			});
		}

		return { object: output.object };
	});
}

export declare namespace GetPagesetUpload {
	type Props = {
		pagesetId: string;
	};
}
