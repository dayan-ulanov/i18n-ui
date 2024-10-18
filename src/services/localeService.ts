import fs from "fs";
import path from "path";
import { IGNORED_FOLDERS, IGNORED_FILES } from "../constants/ignoreFolderPath";
import type { IJsonData } from "../types/localeTypes";
import {
	findFiles,
	showLoadingSpinner,
	writeJsonFile,
} from "../utils/localeUtils";

export class LocaleService {
	static isIgnored(filePath: string): boolean {
		const dirName = path.dirname(filePath);
		const fileName = path.basename(filePath);
		const extname = path.extname(filePath);
	
		if (IGNORED_FOLDERS.has(dirName) || [...IGNORED_FOLDERS].some(ignoredDir => dirName.includes(ignoredDir))) {
			return true;
		}
	
		if (this.isIgnoredFileName(fileName)) {
			return true;
		}
	
		if (extname !== ".json") {
			return true;
		}
	
		return false;
	}

	static isIgnoredFileName(fileName: string): boolean {
		return [...IGNORED_FILES].some(ignoredFile => {
			if (ignoredFile.includes("*")) {
				const regex = new RegExp(ignoredFile.replace("*", ".*"));
				return regex.test(fileName);
			}
			return fileName === ignoredFile;
		});
	}

	static findLocaleFiles(searchPath: string = process.cwd()): string[] {
		console.log(`Ищем файлы переводов в директории: ${searchPath}`);
		const localeFiles = findFiles(searchPath);

		const filteredFiles = localeFiles.filter(file => !this.isIgnored(file));

		const uniqueLocaleFiles = Array.from(new Set(filteredFiles));

		if (uniqueLocaleFiles.length === 0) {
			console.log("Файлы переводов не найдены.");
			process.exit(1);
		}

		return uniqueLocaleFiles;
	}

	static readJSONFile(filePath: string): IJsonData {
		const spinner = showLoadingSpinner("Чтение файла...");

		try {
			if (fs.existsSync(filePath)) {
				const data = fs.readFileSync(filePath, "utf8");
				spinner.succeed("Файл успешно прочитан");
				return JSON.parse(data);
			}
			spinner.fail("Файл не найден");
			return {};
		} catch (error) {
			spinner.fail("Ошибка при чтении файла");
			console.error(error);
			return {};
		}
	}

	static writeJSONFile(filePath: string, data: IJsonData): void {
		try {
			writeJsonFile(filePath, data);
			console.log("Файл успешно записан.");
		} catch (error) {
			console.error("Ошибка при записи в файл:", error);
		}
	}
}
