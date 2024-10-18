import inquirer from "inquirer";
import path from "path";
import { LocaleService } from "../services/localeService";
import { showMenu } from "./menuController";

export async function selectLanguage(): Promise<void> {
	const localeFiles = LocaleService.findLocaleFiles();

	const languageNames = localeFiles.map((filePath) =>
		path.basename(filePath, path.extname(filePath))
	);

	const { languageFile } = await inquirer.prompt([
		{
			type: "list",
			name: "languageFile",
			message: "Выберите файл перевода:",
			choices: languageNames,
		},
	]);

	const filePath = localeFiles[languageNames.indexOf(languageFile)];
	showMenu(filePath);
}
