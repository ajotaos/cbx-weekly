import { createHmac } from 'node:crypto';

export function signMessage(data: string, secret: string) {
	const signature = createHmac('sha256', secret).update(data).digest('hex');

	return Buffer.from(`${data}:${signature}`).toString('base64url');
}

export function verifyMessage(message: string, secret: string) {
	const decodedMessage = Buffer.from(message, 'base64url').toString();

	const delimiterIndex = decodedMessage.lastIndexOf(':');
	if (delimiterIndex === -1) {
		return null;
	}

	const data = decodedMessage.substring(0, delimiterIndex);
	const signature = decodedMessage.substring(delimiterIndex + 1);

	const computedSignature = createHmac('sha256', secret)
		.update(data)
		.digest('hex');

	if (signature !== computedSignature) {
		return null;
	}

	return data;
}
