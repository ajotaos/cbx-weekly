import { DeleteObjectsCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';

import type { S3Client } from '@aws-sdk/client-s3';

export type DeleteObjectsInput = {
	bucketName: string;
	prefix: string;
};

export async function deleteObjects(
	client: S3Client,
	input: DeleteObjectsInput,
) {
	let continuationToken: string | undefined = undefined;

	do {
		const listCommand = new ListObjectsV2Command({
			Bucket: input.bucketName,
			Prefix: input.prefix,
			ContinuationToken: continuationToken,
		}) as ListObjectsV2Command;

		const listResponse = await client.send(listCommand);

		const objects = listResponse.Contents;
		if (!objects || objects.length === 0) {
			break;
		}

		const deleteCommand = new DeleteObjectsCommand({
			Bucket: input.bucketName,
			Delete: {
				// biome-ignore lint/style/noNonNullAssertion: <explanation>
				Objects: objects.map((object) => ({ Key: object.Key! })),
			},
		});

		await client.send(deleteCommand);

		continuationToken = listResponse.NextContinuationToken;
	} while (continuationToken);
}
