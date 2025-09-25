import { get, writable, type Writable } from 'svelte/store';
import type { IConfig, IConfigWrap } from './types';
import { DateTime } from 'luxon';

export const isDark = writable(0);
export const userToken: Writable<{ token: string, expires: number } | undefined> = writable(undefined);
export const config: Writable<IConfigWrap | undefined | null> = writable(undefined);
export const triggerPageUpdate: Writable<string> = writable(
	DateTime.now().toUnixInteger().toString()
);

export function setPreferences(prefs: any) {
	preferences = prefs
}
export let preferences: { [key: string]: Writable<any> } = {}
// export function getPreferences(): { [key: string]: Writable<any> }  {
// 	return
// }

export function savePreferences()
{
	localStorage.setItem('preferences', getPreferencesAsJson());
}
export function getPreferencesAsJson(): string {
	const input = preferences
	if (!input) {
		throw new Error("preferences don't exist, don't call this function until they are set")
	}
	const val: any = {}
	for (const key of Object.keys(input)) {
		val[key] = get(input[key])
	}
	return JSON.stringify(val, undefined, 2)
}

export function getPreferencesFromJson(jsonStr: string): { [key: string]: Writable<any> } {
	const parsed = JSON.parse(jsonStr)
	const result: any = {}
	for (const key of Object.keys(parsed)) {
		result[key] = writable(parsed[key])
	}
	return result
}