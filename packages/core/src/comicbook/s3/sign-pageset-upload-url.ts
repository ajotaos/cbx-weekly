import { makePagesetUploadKey } from './keys/pageset-upload';

import { S3 } from '@cbx-weekly/utils/s3';

import * as v from '@cbx-weekly/valibot/core';

import type { S3Client } from '@aws-sdk/client-s3';

export async function signPagesetUploadUrl(
	props: SignPagesetUploadUrl.Props,
	bucketName: string,
	client: S3Client,
) {
	const pagesetId = parsePagesetId(props.pagesetId);

	const expiresIn = parseExpiresIn(props.expiresIn);

	const key = makePagesetUploadKey({ pagesetId });

	return S3.signPutObjectUrl(
		client,
		{
			bucketName,
			key,
			contentType: 'application/zip',
			metadata: {
				'pageset-id': pagesetId,
			},
		},
		{ expiresIn },
	);
}

const parseExpiresIn = v.parser(v.pipe(v.number(), v.integer(), v.minValue(0)));
const parsePagesetId = v.parser(v.pipe(v.string(), v.id()));

export declare namespace SignPagesetUploadUrl {
	type Props = {
		pagesetId: string;
		expiresIn: number;
	};
}
