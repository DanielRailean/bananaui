import { apiService } from './requests';
import type { IPlugins } from './responseTypes';
import { addToast, confirmToast } from './toastStore';
import type { IConfig, IKongPlugin } from './types';

export const delay = (delayInms: number) => {
	return new Promise((resolve) => setTimeout(resolve, delayInms));
};

export const writeToClipboard = (
	text: string,
	extraNotifyText = "",
	onSuccess: (value: void) => void = () => {
		confirmToast(`copied${extraNotifyText}`);
	}
) => {
	navigator.clipboard.writeText(text).then(onSuccess, () => {
		/* clipboard write failed */
	});
};

export function debouncedCall<T extends (...args: any[]) => any>(fn: T, delay: number) {
	let timeoutId: number | null = null;

	const debounced = function (...args: Parameters<T>): void {
		if (timeoutId) {
			clearTimeout(timeoutId)
		}
		timeoutId = setTimeout(() => {
			fn(...args)
		}, delay);
	}

	debounced.cancel = () => {
		if (timeoutId) {
			clearTimeout(timeoutId);
			timeoutId = null;
		}
	};

	debounced.flush = (...args: Parameters<T>) => {
		if (timeoutId) {
			clearTimeout(timeoutId);
			timeoutId = null;
		}
		fn(...args);
	};

	return debounced as typeof debounced & {
		cancel: () => void,
		flush: (...args: Parameters<T>) => void,
	}
}

export function capitalizeFirstLetter(string?: string) {
	if (!string) return "";
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

export function setLocalStorageConfig(config: IConfig) {
	const confStr = localStorage.setItem(LOCALSTORAGE_CONFIG_KEY, JSON.stringify(config));
}

let pluginMap: { [key: string]: number } | undefined = undefined
export async function getPluginPriorityMap(): Promise<{ [key: string]: number }> {
	if (pluginMap) {
		return pluginMap
	}
	const res = await (await apiService()).getInfo();
	let infoRaw = res.data;
	const pluginsMap: { [key: string]: number } = {}
	let plugArr = Object.entries(infoRaw?.plugins.available_on_server ?? {})
		.sort((a, b) => b[1].priority - a[1].priority)
	for (const plugin of plugArr) {
		pluginsMap[plugin[0]] = plugin[1].priority
	}
	pluginMap = pluginsMap
	return pluginsMap
}

export async function getPlugins(parentPath = "/"): Promise<IKongPlugin[]> {
	const plugins = await (await apiService()).findAll("plugins", {}, parentPath);
	return plugins.data?.data as IKongPlugin[];
	// return []
}