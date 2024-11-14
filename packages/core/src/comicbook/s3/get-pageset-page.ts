import { makePagesetPageKey } from './keys/pageset-page';
import { pagesetPageMetadataSchema } from './types/pageset-page';

import { S3 } from '@cbx-weekly/utils/s3';

import type { S3Client } from '@aws-sdk/client-s3';

export async function getPagesetPage(
	props: GetPagesetPage.Props,
	bucketName: string,
	client: S3Client,
) {
	const key = makePagesetPageKey({
		number: props.number,
		pagesetId: props.pagesetId,
	});

	return S3.getObject(
		client,
		{
			bucketName,
			key,
		},
		pagesetPageMetadataSchema,
	).then((output) => {
		if (output.object === undefined) {
			throw S3.Errors.objectNotFound.make('pageset page', {
				id: props.pagesetId,
			});
		}

		return { object: output.object };
	});
}

export declare namespace GetPagesetPage {
	type Props = {
		number: string;
		pagesetId: string;
	};
}
