import { addToast } from './stores';

export const delay = (delayInms: number) => {
	return new Promise((resolve) => setTimeout(resolve, delayInms));
};

export const writeToClipboard = (
	text: string,
	onSuccess: (value: void) => void = () => {
		addToast({ message: 'copied', type: 'success' });
	}
) => {
	navigator.clipboard.writeText(text).then(onSuccess, () => {
		/* clipboard write failed */
	});
};
