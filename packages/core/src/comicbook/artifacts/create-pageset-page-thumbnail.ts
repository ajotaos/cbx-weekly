import { Files } from '@cbx-weekly/utils/files';

import sharp from 'sharp';

import { Readable } from 'node:stream';

export async function createPagesetPageThumbnail(body: Uint8Array) {
	await Files.validateFileType(body, new Set(['image/jpeg']));

	return uint8ArrayToStream(body)
		.pipe(createPageThumbnailPipeline())
		.toBuffer();
}

function createPageThumbnailPipeline() {
	return sharp().resize(undefined, 750).jpeg({
		quality: 80, // Set quality
		mozjpeg: true, // Use MozJPEG for better compression
		chromaSubsampling: '4:2:0', // Reduce chroma data to lower file size
		progressive: true, // Create a progressive JPEG
		trellisQuantisation: true, // Further optimize compression
		overshootDeringing: true, // Improve visual quality during compression
	});
}

function uint8ArrayToStream(data: Uint8Array) {
	let offset = 0;

	return new Readable({
		read(size) {
			if (offset >= data.length) {
				this.push(null); // Signal end of stream
				return;
			}

			// Push a chunk of data to the stream
			const chunk = data.subarray(offset, offset + size);
			offset += chunk.length;
			this.push(chunk);
		},
	});
}
