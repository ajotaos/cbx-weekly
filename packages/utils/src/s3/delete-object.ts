import { DeleteObjectCommand } from '@aws-sdk/client-s3';

import type { S3Client } from '@aws-sdk/client-s3';

export type DeleteObjectInput = {
	bucketName: string;
	key: string;
};

export async function deleteObject(client: S3Client, input: DeleteObjectInput) {
	const command = new DeleteObjectCommand({
		Bucket: input.bucketName,
		Key: input.key,
	});

	await client.send(command);
}
