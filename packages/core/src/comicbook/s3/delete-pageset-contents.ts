import { makePagesetContentsPrefix } from './keys/pageset-contents';

import { S3 } from '@cbx-weekly/utils/s3';

import type { S3Client } from '@aws-sdk/client-s3';

export async function deletePagesetContents(
	props: GetPagesetUpload.Props,
	bucketName: string,
	client: S3Client,
) {
	const prefix = makePagesetContentsPrefix({ pagesetId: props.pagesetId });

	return S3.deleteObjects(client, {
		bucketName,
		prefix,
	});
}

export declare namespace GetPagesetUpload {
	type Props = {
		pagesetId: string;
	};
}
