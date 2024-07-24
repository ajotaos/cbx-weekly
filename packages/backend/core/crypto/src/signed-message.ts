import { createHmac } from 'node:crypto';

export function createSignedMessage(data: string, secret: string) {
	const signature = createHmac('sha256', secret).update(data).digest('hex');

	return Buffer.from(`${data}:${signature}`).toString('base64url');
}

type ExtractSignedDataResult =
	| { verified: true; data: string }
	| { verified: false };

export function extractSignedData(
	message: string,
	secret: string,
): ExtractSignedDataResult {
	const decodedMessage = Buffer.from(message, 'base64url').toString();

	const delimiterIndex = decodedMessage.lastIndexOf(':');
	if (delimiterIndex === -1) {
		return { verified: false };
	}

	const data = decodedMessage.substring(0, delimiterIndex);
	const signature = decodedMessage.substring(delimiterIndex + 1);

	const computedSignature = createHmac('sha256', secret)
		.update(data)
		.digest('hex');

	if (signature !== computedSignature) {
		return { verified: false };
	}

	return { verified: true, data };
}
