import path from "path";
import fs from "fs";
import { IGNORED_DIRECTORIES } from "../constants/ignoreFolderPath";
import type { IJsonData } from '../types/localeTypes'
import { showLoadingSpinner } from '../utils/localeUtils'

export class LocaleService {
	static isIgnored(filePath: string): boolean {
		const fileName = path.basename(filePath);
		const dirName = path.basename(path.dirname(fileName));
		return (
			IGNORED_DIRECTORIES.has(fileName) || IGNORED_DIRECTORIES.has(dirName)
		);
	}

	static findLocaleFiles(searchPath: string = process.cwd()): string[] {
		console.log(`Ищем файлы переводов в директории: ${searchPath}`);
		const localeFiles = findFiles(searchPath);

		if (localeFiles.length === 0) {
			console.log("Файлы переводов не найдены.");
			process.exit(1);
		}

		return localeFiles;
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
		} catch(error) {
			spinner.fail("Ошибка при чтении файла");
			console.error(error);
			return {};
		}
	}
}
