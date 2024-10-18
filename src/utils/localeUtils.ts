import fs from 'fs';
import path from 'path';
import type { Ora } from 'ora'
import ora from 'ora'

export function showLoadingSpinner(message: string): Ora {
	return ora(message).start();
}

export function findFiles(dirPath: string): string[] {
	let files: string[] = [];

	fs.readdirSync(dirPath).forEach((file) => {
		const fullPath = path.join(dirPath, file);
		if (fs.statSync(fullPath).isDirectory()) {
			files = [...files, ...findFiles(fullPath)];
		} else {
			if (file.endsWith(".json")) {
				files.push(fullPath);
			}
		}
	});

	return files;
}