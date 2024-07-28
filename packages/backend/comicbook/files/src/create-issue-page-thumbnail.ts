import sharp from 'sharp';

import { fileTypeFromBuffer } from 'file-type';

import { throwUnsupportedFileTypeError } from '@cbx-weekly/backend-core-errors';

export async function createIssuePageThumbnail(body: Uint8Array) {
	const mimeType = await getMimeTypeFromBuffer(body);
	if (mimeType !== 'image/jpeg') {
		throwUnsupportedFileTypeError(mimeType);
	}

	return sharp(body)
		.resize(undefined, 750)
		.jpeg({
			quality: 80, // Set quality
			mozjpeg: true, // Use MozJPEG for better compression
			chromaSubsampling: '4:2:0', // Reduce chroma data to lower file size
			progressive: true, // Create a progressive JPEG
			trellisQuantisation: true, // Further optimize compression
			overshootDeringing: true, // Improve visual quality during compression
		})
		.toBuffer();
}

async function getMimeTypeFromBuffer(body: Uint8Array) {
	const fileType = await fileTypeFromBuffer(body);
	return fileType?.mime ?? 'application/octet-stream';
}
