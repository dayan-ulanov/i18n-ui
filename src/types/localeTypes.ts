export interface IJsonData {
	[key: string]: string;
}

export interface IUpdateKeyPromptAnswer {
	newValue: string;
}

export interface IKeyActionPromptAnswers {
	action: "Изменить значение" | "Удалить ключ" | "Вернуться к меню";
}
