import type { Ora } from 'ora'
import ora from 'ora'

export function showLoadingSpinner(message: string): Ora {
	return ora(message).start();
}