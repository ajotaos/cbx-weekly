import JSZip from 'jszip';
import sharp from 'sharp';

import { Open } from 'unzipper';

import {
	mimeTypeFromData,
	mimeTypeFromStream,
	throwUnsupportedFileTypeError,
} from '@cbx-weekly/backend-core-files';

import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

export async function createIssuePagesArchive(
	body: Uint8Array,
	processPage: (body: Uint8Array) => unknown,
) {
	const mimeType = await mimeTypeFromData(body);
	if (mimeType !== 'application/zip') {
		throwUnsupportedFileTypeError(mimeType);
	}

	const tempDir = await mkdtemp(join(tmpdir(), '/'));
	const zipFilePath = join(tempDir, 'compressed.zip');
	await writeFile(zipFilePath, body);

	const directory = await Open.file(zipFilePath);

	const files = directory.files
		.filter((file) => file.type === 'File')
		.toSorted((a, b) => a.path.localeCompare(b.path, 'en'));

	const zip = new JSZip();

	for (const [index, file] of files.entries()) {
		const mimeType = await mimeTypeFromStream(file.stream());
		if (mimeType !== 'image/jpeg') {
			continue;
		}

		const issuePage = await file
			.stream()
			.pipe(
				sharp().jpeg({
					quality: 100, // Maximize image quality
					mozjpeg: true, // Use MozJPEG for better compression
					chromaSubsampling: '4:4:4', // Retain full color data
					progressive: true, // Progressive loading for web
					trellisQuantisation: false, // Disable trellis quantization for better detail
					overshootDeringing: false, // Disable deringing to preserve detail
				}),
			)
			.toBuffer();

		await processPage(issuePage);

		const number = (index + 1).toString().padStart(3, '0');
		const filename = join(`${number}.jpg`);

		zip.file(filename, issuePage, {
			binary: true,
		});
	}

	const issuePagesArchive = await zip.generateAsync({
		type: 'uint8array',
	});

	await rm(tempDir, { recursive: true, force: true });

	return issuePagesArchive;
}
