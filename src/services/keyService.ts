import inquirer from "inquirer";
import { LocaleService } from "./localeService";
import { showMenu } from '../controllers/menuController'

export class KeyService {
	static async addKey(filePath: string): Promise<void> {
		const data = LocaleService.readJSONFile(filePath);

		const { key, value } = await inquirer.prompt([
			{
				type: "input",
				name: "key",
				message: "Введите уникальное имя для ключа перевода:",
				validate: (input) => (input ? true : "Имя ключа не может быть пустым"),
			},
			{
				type: "input",
				name: "value",
				message: "Введите значение для ключа:",
				validate: (input) =>
					input ? true : "Значение ключа не может быть пустым",
			},
		]);

		data[key] = value;
		LocaleService.writeJSONFile(filePath, data);
		console.log("Ключ успешно добавлен.");
		showMenu(filePath);
	}

	static async updateKey(filePath: string): Promise<void> {
		const data = LocaleService.readJSONFile(filePath);
		const keys = Object.keys(data);

		if (keys.length === 0) {
			console.log("Нет ключей для изменения.");
			return showMenu(filePath);
		}

		const { key, newValue } = await inquirer.prompt([
			{
				type: "list",
				name: "key",
				message: "Выберите ключ для изменения:",
				choices: keys,
			},
			{
				type: "input",
				name: "newValue",
				message: "Введите значение для ключа:",
			},
		]);

		data[key] = newValue;
		LocaleService.writeJSONFile(filePath, data);
		console.log("Значение ключа успешно обновлено.");
		showMenu(filePath);
	}

	static async deleteKey(filePath: string): Promise<void> {
		const data = LocaleService.readJSONFile(filePath);
		const keys = Object.keys(data);

		if (keys.length === 0) {
			console.log("Нет ключей для удаления.");
			return showMenu(filePath);
		}

		const { key } = await inquirer.prompt([
			{
				type: "list",
				name: "key",
				message: "Выберите ключ для удаления:",
				choices: keys,
			},
		]);

		delete data[key];
		LocaleService.writeJSONFile(filePath, data);
		console.log("Ключ успешно удалён.");
		showMenu(filePath);
	}
}
