import { createReadStream } from 'node:fs';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileTypeFromStream } from 'file-type';
import { ReReadable } from 'rereadable-stream';
import { Open } from 'unzipper';

import { throwUnsupportedFileTypeError } from '@cbx-weekly/backend-core-errors';

import type { Readable } from 'node:stream';

export async function createZipUnarchiver(props: Readable) {
	const body = props.pipe(new ReReadable());

	const mimeType = await getMimeTypeFromStream(body.rewind());

	if (mimeType !== 'application/zip') {
		throwUnsupportedFileTypeError(mimeType);
	}

	return {
		async *files() {
			const tempDir = await mkdtemp(join(tmpdir(), '/'));
			const zipFilePath = join(tempDir, 'compressed.zip');
			await writeFile(zipFilePath, body.rewind());

			const extractDir = join(tempDir, 'extracted');
			await mkdir(extractDir);

			yield* processZipFiles(zipFilePath, extractDir);

			await rm(tempDir, { recursive: true, force: true });
		},
	};
}

async function getMimeTypeFromStream(body: Readable) {
	const fileType = await fileTypeFromStream(body);
	return fileType?.mime ?? 'application/octet-stream';
}

async function* processZipFiles(zipFilePath: string, extractDir: string) {
	const directory = await Open.file(zipFilePath);
	await directory.extract({ path: extractDir });

	const files = directory.files
		.filter((file) => file.type === 'File')
		.sort((a, b) => a.path.localeCompare(b.path, 'en'));

	for (const file of files) {
		const extractedFilePath = join(extractDir, file.path);

		let rereadable: ReReadable;

		yield {
			stream() {
				if (!rereadable) {
					rereadable = createReadStream(extractedFilePath).pipe(
						new ReReadable(),
					);
				}

				return rereadable.rewind();
			},
		};
	}
}
