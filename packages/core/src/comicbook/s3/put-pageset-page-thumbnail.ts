import { makePagesetPageThumbnailKey } from './keys/pageset-page-thumbnail';

import { S3 } from '@cbx-weekly/utils/s3';

import * as v_comicbook from '@cbx-weekly/valibot/comicbook';
import * as v from '@cbx-weekly/valibot/core';

import type { S3Client } from '@aws-sdk/client-s3';

export async function putPagesetPageThumbnail(
	body: Uint8Array,
	props: PutPagesetPage.Props,
	bucketName: string,
	client: S3Client,
) {
	const pagesetId = parsePagesetId(props.pagesetId);

	const number = parseNumber(props.number);

	const key = makePagesetPageThumbnailKey({ number, pagesetId });

	return S3.putObject(client, {
		bucketName,
		key,
		body,
		contentType: 'image/jpeg',
		metadata: {
			number,
			'pageset-id': pagesetId,
		},
	});
}

const parseNumber = v.parser(
	v.pipe(v.string(), v_comicbook.pagesetPageNumber()),
);
const parsePagesetId = v.parser(v.pipe(v.string(), v.id()));

export declare namespace PutPagesetPage {
	type Props = {
		number: string;
		pagesetId: string;
	};
}
