import { addToast } from './toastStore';
import type { IConfig } from './types';

export const delay = (delayInms: number) => {
	return new Promise((resolve) => setTimeout(resolve, delayInms));
};

export const writeToClipboard = (
	text: string,
	onSuccess: (value: void) => void = () => {
		addToast({ message: 'copied', type: 'info' });
	}
) => {
	navigator.clipboard.writeText(text).then(onSuccess, () => {
		/* clipboard write failed */
	});
};

export function capitalizeFirstLetter(string?: string) {
	if (!string) return string;
	return string.charAt(0).toUpperCase() + string.slice(1);
}

export const LOCALSTORAGE_CONFIG_KEY = 'BANANA_UI_CONFIG';
export function getLocalStorageConfig(): IConfig | undefined {
	const confStr = localStorage.getItem(LOCALSTORAGE_CONFIG_KEY);
	if (confStr) {
		return JSON.parse(confStr) as IConfig;
	}
	return undefined;
}
