import fs from "fs";
import type { Ora } from "ora";
import ora from "ora";
import path from "path";

export function writeJsonFile(filePath: string, data: any): void {
	fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

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
