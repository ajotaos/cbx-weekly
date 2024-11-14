import fs from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

class TempDirectory {
	constructor(readonly path: string) {}

	getFilePath(filename: string) {
		return join(this.path, filename);
	}

	async createFile(filename: string, content: string | Uint8Array = '') {
		const filePath = join(this.path, filename);
		await fs.writeFile(filePath, content);
		return filePath;
	}

	async createSubdirectory(dirname: string) {
		const dirPath = join(this.path, dirname);
		await fs.mkdir(dirPath);
		return dirPath;
	}

	async listFiles() {
		return await fs.readdir(this.path);
	}

	async deleteFile(filename: string) {
		const filePath = join(this.path, filename);
		await fs.rm(filePath, { force: true });
	}

	async [Symbol.asyncDispose]() {
		await fs.rm(this.path, { recursive: true, force: true });
	}
}

export async function createTempDirectory() {
	const tempDirPath = await fs.mkdtemp(join(tmpdir(), '/'));
	return new TempDirectory(tempDirPath);
}
