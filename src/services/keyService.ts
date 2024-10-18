import inquirer from "inquirer";
import { LocaleService } from "./localeService";

export class KeyService {
	static async addKey(filePath: string): Promise<void> {
		const data = LocaleService.readJSONFile(filePath);

		console.log(data);

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
		// FIX_ME: Нужно добавить showMenu функцию
		// showMenu(filePath);
	}

	static async updateKey(filePath: string): Promise<void> {
		const data = LocaleService.readJSONFile(filePath);
		const keys = Object.keys(data);

		if (keys.length === 0) {
			console.log("Нет ключей для изменения.");
			// FIX_ME: Нужно добавить showMenu функцию
			// return showMenu(filePath);
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
		// FIX_ME: Нужно добавить showMenu функцию
		// showMenu(filePath);
	}

	static async deleteKey(filePath: string): Promise<void> {
		const data = LocaleService.readJSONFile(filePath);
		const keys = Object.keys(data);

		if (keys.length === 0) {
			console.log("Нет ключей для удаления.");
			// FIX_ME: Нужно добавить showMenu функцию
			// return showMenu(filePath);
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
		// FIX_ME: Нужно добавить showMenu функцию
		// showMenu(filePath);
	}
}
