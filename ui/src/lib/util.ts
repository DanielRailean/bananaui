import { apiService } from './requests';
import type { IPlugins } from './responseTypes';
import { addToast, confirmToast } from './toastStore';
import type { IConfig, IKongPlugin } from './types';

export const delay = (delayInms: number) => {
	return new Promise((resolve) => setTimeout(resolve, delayInms));
};

export const writeToClipboard = (
	text: string,
	onSuccess: (value: void) => void = () => {
		confirmToast('copied');
	}
) => {
	navigator.clipboard.writeText(text).then(onSuccess, () => {
		/* clipboard write failed */
	});
};

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