import JSZip from 'jszip';

import { join } from 'node:path';

export function createIssuePagesArchiver() {
	const zip = new JSZip();

	return {
		page(body: Uint8Array, index: number) {
			const number = (index + 1).toString().padStart(3, '0');
			const filename = join(`${number}.jpg`);

			zip.file(filename, body, {
				binary: true,
			});
		},
		buffer() {
			return zip.generateAsync({
				type: 'uint8array',
				// streamFiles: true,
			});
		},
	};
}
