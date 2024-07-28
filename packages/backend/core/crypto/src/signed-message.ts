import { createHmac } from 'node:crypto';

import { throwInvalidSignedMessageError } from './errors';

export function createSignedMessage(data: string, secret: string) {
	const signature = createHmac('sha256', secret).update(data).digest('hex');

	return Buffer.from(`${data}:${signature}`).toString('base64url');
}

export function extractSignedData(message: string, secret: string) {
	const decodedMessage = Buffer.from(message, 'base64url').toString();

	const delimiterIndex = decodedMessage.lastIndexOf(':');
	if (delimiterIndex === -1) {
		throwInvalidSignedMessageError();
	}

	const data = decodedMessage.substring(0, delimiterIndex);
	const signature = decodedMessage.substring(delimiterIndex + 1);

	const computedSignature = createHmac('sha256', secret)
		.update(data)
		.digest('hex');

	if (signature !== computedSignature) {
		throwInvalidSignedMessageError();
	}

	return data;
}
