import { GetObjectCommand } from '@aws-sdk/client-s3';

import * as v from '@cbx-weekly/valibot/core';

import type { Metadata } from './types';

import type { S3Client } from '@aws-sdk/client-s3';

import type { GenericSchema, InferOutput } from '@cbx-weekly/valibot/core';

export type GetObjectInput = {
	bucketName: string;
	key: string;
};

export type GetObjectOutput<TMetadata extends Metadata> = {
	object?: {
		body: () => Promise<Uint8Array>;
		metadata: TMetadata;
	};
};

export async function getObject<
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	TMetadataSchema extends GenericSchema<Metadata, any>,
>(
	client: S3Client,
	input: GetObjectInput,
	metadataSchema: TMetadataSchema,
): Promise<GetObjectOutput<InferOutput<TMetadataSchema>>> {
	const command = new GetObjectCommand({
		Bucket: input.bucketName,
		Key: input.key,
	});

	return client.send(command).then((output) => {
		if (output.Body === undefined) {
			return {};
		}

		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		const body = () => output.Body!.transformToByteArray();
		const metadata = v.parse(metadataSchema, output.Metadata);

		return { object: { body, metadata } };
	});
}
