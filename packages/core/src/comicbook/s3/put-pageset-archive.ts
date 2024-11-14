import { makePagesetArchiveKey } from './keys/pageset-archive';

import { S3 } from '@cbx-weekly/utils/s3';

import * as v from '@cbx-weekly/valibot/core';

import type { S3Client } from '@aws-sdk/client-s3';

export async function putPagesetArchive(
	body: Uint8Array,
	props: PutPagesetArchive.Props,
	bucketName: string,
	client: S3Client,
) {
	const pagesetId = parsePagesetId(props.pagesetId);

	const key = makePagesetArchiveKey({ pagesetId });

	return S3.putObject(client, {
		bucketName,
		key,
		body,
		contentType: 'application/zip',
		metadata: {
			'pageset-id': pagesetId,
		},
	});
}

const parsePagesetId = v.parser(v.pipe(v.string(), v.id()));

export declare namespace PutPagesetArchive {
	type Props = {
		pagesetId: string;
	};
}
