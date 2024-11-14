import { makePagesetUploadKey } from './keys/pageset-upload';

import { S3 } from '@cbx-weekly/utils/s3';

import type { S3Client } from '@aws-sdk/client-s3';

export async function deletePagesetUpload(
	props: GetPagesetUpload.Props,
	bucketName: string,
	client: S3Client,
) {
	const key = makePagesetUploadKey({ pagesetId: props.pagesetId });

	return S3.deleteObject(client, {
		bucketName,
		key,
	});
}

export declare namespace GetPagesetUpload {
	type Props = {
		pagesetId: string;
	};
}
