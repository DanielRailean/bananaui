import { addToast } from './stores';

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
