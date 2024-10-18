import inquirer from "inquirer";
import { KeyService } from "../services/keyService";
import { LocaleService } from "../services/localeService";
import type { IJsonData } from "../types/localeTypes";
import { selectLanguage } from "./languageController";

export async function showMenu(filePath: string): Promise<void> {
	const choices: string[] = [
		"Добавить ключ",
		"Изменить значение",
		"Удалить ключ",
		"Показать данные",
		"Поиск ключа",
		"Вернуться к выбору языка",
		"Выход",
	];

	const { action } = await inquirer.prompt([
		{
			type: "list",
			name: "action",
			message: "Что вы хотите сделать?",
			choices,
		},
	]);

	switch (action) {
		case choices[0]:
			await KeyService.addKey(filePath);
			break;
		case choices[1]:
			await KeyService.updateKey(filePath);
			break;
		case choices[2]:
			await KeyService.deleteKey(filePath);
			break;
		case choices[3]:
			showData(filePath);
			break;
		case choices[4]:
			searchKey(LocaleService.readJSONFile(filePath), filePath);
			break;
		case choices[5]:
			selectLanguage();
			break;
		case choices[6]:
			console.log("До свидания!");
			break;
	}
}

async function showData(filePath: string): Promise<void> {
	const data = LocaleService.readJSONFile(filePath);
	console.log("Текущие данные:", data);
	await showMenu(filePath);
}

async function searchKey(data: IJsonData, filePath: string): Promise<void> {
	const searchPrompt = await inquirer.prompt([
		{
			type: "input",
			name: "keySearch",
			message: "Введите часть ключа для поиска (для выхода введите 'exit'):",
		},
	]);

	const keySearch = searchPrompt.keySearch.trim().toLowerCase();
	if (keySearch === "exit") return showMenu(filePath);

	const foundKeys = Object.keys(data).filter((key) =>
		key.toLowerCase().includes(keySearch)
	);

	if (foundKeys.length > 0) {
		const selection = await inquirer.prompt([
			{
				type: "list",
				name: "selectedKey",
				message: "Выберите ключ из найденных:",
				choices: [...foundKeys, "Изменить запрос", "Назад"],
			},
		]);

		if (selection.selectedKey === "Назад") return showMenu(filePath);
		if (selection.selectedKey === "Изменить запрос")
			return searchKey(data, filePath);

		await handleKeyAction(data, filePath, selection.selectedKey);
	} else {
		const retry = await inquirer.prompt([
			{
				type: "confirm",
				name: "retry",
				message: "Ключи не найдены. Хотите изменить запрос?",
				default: true,
			},
		]);

		if (retry) {
			return searchKey(data, filePath);
		} else {
			console.log("Ключи не найдены.");
			return showMenu(filePath);
		}
	}
}

async function handleKeyAction(
	data: IJsonData,
	filePath: string,
	selectedKey: string
): Promise<void> {
	const keyActionPrompt = await inquirer.prompt([
		{
			type: "list",
			name: "action",
			message: `Выберите действие для ключа "${selectedKey}":`,
			choices: ["Изменить значение", "Удалить ключ", "Вернуться к меню"],
		},
	]);

	if (keyActionPrompt.action === "Изменить значение") {
		const { newValue } = await inquirer.prompt([
			{
				type: "input",
				name: "newValue",
				message: "Введите новое значение для ключа:",
			}
		]);

		data[selectedKey] = newValue;
		LocaleService.writeJSONFile(filePath, data);
		console.log(`Значение ключа "${selectedKey}" успешно обновлено.`);
		return showMenu(filePath);
	} else if (keyActionPrompt.action === "Удалить ключ") {
		delete data[selectedKey];
		LocaleService.writeJSONFile(filePath, data);
		console.log(`Ключ "${selectedKey}" успешно удалён.`);
	} else {
		await showMenu(filePath);
	}
}
