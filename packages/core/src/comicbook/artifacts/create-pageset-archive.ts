import { Files } from '@cbx-weekly/utils/files';

import JSZip from 'jszip';
import sharp from 'sharp';

import { Open } from 'unzipper';

import type { File } from 'unzipper';

export async function createPagesetArchive(
	body: Uint8Array,
	processPage: (body: Uint8Array, number: string) => Promise<void>,
) {
	await Files.validateFileType(body, new Set(['application/zip']));

	const tempDirectory = await Files.System.createTempDirectory();

	const uploadPath = await tempDirectory.createFile('compressed.zip', body);

	const zip = new JSZip();

	const pageFiles = await pageFilesFromUpload(uploadPath);

	for (const [index, file] of pageFiles.entries()) {
		const number = (index + 1).toString().padStart(3, '0');
		const page = await file.stream().pipe(createPagePipeline()).toBuffer();

		await processPage(page, number);

		const filename = `${number}.jpg`;
		zip.file(filename, page, {
			binary: true,
		});
	}

	return zip.generateAsync({
		type: 'uint8array',
	});
}

async function pageFilesFromUpload(path: string) {
	const directory = await Open.file(path);

	const files = await asyncFilter(directory.files, isPageFile);
	files.sort((a, b) => a.path.localeCompare(b.path, 'en'));

	return files;
}

async function isPageFile(file: File) {
	if (file.type !== 'File') {
		return false;
	}

	try {
		await Files.validateFileType(file.stream(), new Set(['image/jpeg']));
	} catch {
		return false;
	}

	return true;
}

function createPagePipeline() {
	return sharp().jpeg({
		quality: 100, // Maximize image quality
		mozjpeg: true, // Use MozJPEG for better compression
		chromaSubsampling: '4:4:4', // Retain full color data
		progressive: true, // Progressive loading for web
		trellisQuantisation: false, // Disable trellis quantization for better detail
		overshootDeringing: false, // Disable deringing to preserve detail
	});
}

type AsyncPredicate<T> = (item: T) => Promise<boolean>;

async function asyncFilter<T>(
	items: Array<T>,
	predicate: AsyncPredicate<T>,
): Promise<Array<T>> {
	const results = await Promise.all(
		items.map(async (item) => ({
			item,
			keep: await predicate(item),
		})),
	);

	return results.filter((result) => result.keep).map((result) => result.item);
}
