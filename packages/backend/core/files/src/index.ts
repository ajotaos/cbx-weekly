import { fileTypeFromBuffer, fileTypeFromStream } from 'file-type';

import type { Readable } from 'node:stream';

export async function mimeTypeFromData(data: Uint8Array) {
	const fileType = await fileTypeFromBuffer(data);
	const mimeType = fileType?.mime ?? 'application/octet-stream';

	return mimeType;
}

export async function mimeTypeFromStream(stream: Readable) {
	// @ts-expect-error
	const fileType = await fileTypeFromStream(stream);
	const mimeType = fileType?.mime ?? 'application/octet-stream';

	return mimeType;
}

export * from './errors';
