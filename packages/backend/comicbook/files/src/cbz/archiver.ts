import JSZip from 'jszip';

import { join } from 'node:path';

export function createCbzArchiver() {
	const zip = new JSZip();

	return {
		page(body: Uint8Array, index: number) {
			const number = (index + 1).toString().padStart(3, '0');
			const filename = join(`${number}.jpg`);
			console.log(filename);

			zip.file(filename, body, {
				binary: true,
			});
		},
		stream() {
			return zip.generateAsync({
				type: 'uint8array',
				// streamFiles: true,
			});
		},
	};
}
