import JSZip from 'jszip';

import { join } from 'node:path';

import type { Readable } from 'node:stream';

export function createCbzArchiver() {
	const zip = new JSZip();

	return {
		page(body: Readable, index: number) {
			const number = (index + 1).toString().padStart(3, '0');
			const filename = join(`${number}.jpg`);

			zip.file(filename, body, {
				binary: true,
			});
		},
		stream() {
			return zip.generateNodeStream({
				type: 'nodebuffer',
				streamFiles: true,
			}) as Readable;
		},
	};
}
