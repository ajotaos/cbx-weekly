import sharp from 'sharp';

import { fileTypeFromBuffer, fileTypeFromStream } from 'file-type';
import { Open } from 'unzipper';

import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { throwUnsupportedFileTypeError } from '@cbx-weekly/backend-core-errors';

import type { Readable } from 'node:stream';

export async function createZipUnarchiver(body: Uint8Array) {
	const mimeType = await getMimeTypeFromBuffer(body);
	if (mimeType !== 'application/zip') {
		throwUnsupportedFileTypeError(mimeType);
	}

	return {
		async *files() {
			const tempDir = await mkdtemp(join(tmpdir(), '/'));
			const zipFilePath = join(tempDir, 'compressed.zip');
			await writeFile(zipFilePath, body);

			const extractDir = join(tempDir, 'extracted');
			await mkdir(extractDir);

			yield* processZipFiles(zipFilePath, extractDir);

			await rm(tempDir, { recursive: true, force: true });
		},
	};
}

async function* processZipFiles(zipFilePath: string, extractDir: string) {
	const directory = await Open.file(zipFilePath);
	await directory.extract({ path: extractDir });

	const files = directory.files
		.filter((file) => file.type === 'File')
		.sort((a, b) => a.path.localeCompare(b.path, 'en'));

	for (const file of files) {
		const mimeType = await getMimeTypeFromStream(file.stream());
		if (mimeType !== 'image/jpeg') {
			continue;
		}

		yield {
			async buffer() {
				const buffer = await file.buffer();
				const pipeline = sharp(buffer);

				return pipeline
					.jpeg({
						quality: 100,
						progressive: true,
						chromaSubsampling: '4:4:4',
						mozjpeg: true,
					})
					.toBuffer();
			},
		};
	}
}

async function getMimeTypeFromBuffer(body: Uint8Array) {
	const fileType = await fileTypeFromBuffer(body);
	return fileType?.mime ?? 'application/octet-stream';
}

async function getMimeTypeFromStream(body: Readable) {
	const fileType = await fileTypeFromStream(body);
	return fileType?.mime ?? 'application/octet-stream';
}
