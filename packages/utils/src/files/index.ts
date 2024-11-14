import { fromBuffer, fromStream } from 'file-type';

import { createTempDirectory as _createTempDirectory } from './temp';

import { unsupportedFileTypeError } from './errors';

import type { MimeType } from 'file-type';

import type { Readable } from 'node:stream';

export namespace Files {
	export async function validateFileType<
		TMimeType extends MimeType | 'application/octet-stream',
	>(
		dataOrStream: Uint8Array | Readable,
		allowedFileTypes: Set<TMimeType>,
	): Promise<TMimeType> {
		const detectedFileType = await (dataOrStream instanceof Uint8Array
			? fromBuffer(dataOrStream)
			: fromStream(dataOrStream)
		).then((fileType) => fileType?.mime ?? 'application/octet-stream');

		// @ts-expect-error
		if (!allowedFileTypes.has(detectedFileType)) {
			throw Files.Errors.unsupportedFileType.make(detectedFileType);
		}

		// @ts-expect-error
		return detectedFileType;
	}

	export namespace System {
		export const createTempDirectory = _createTempDirectory;
	}

	export namespace Errors {
		export const unsupportedFileType = unsupportedFileTypeError;
	}
}
