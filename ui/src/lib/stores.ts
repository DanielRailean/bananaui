import { writable, type Writable } from 'svelte/store';
import type { IConfig, IConfigWrap, IToast } from './types';
import { DateTime } from 'luxon';

export const isDark = writable(0);
export const userToken: Writable<string | undefined> = writable(undefined);
export const config: Writable<IConfigWrap | undefined | null> = writable(undefined);
export const triggerPageUpdate: Writable<string> = writable(
	DateTime.now().toUnixInteger().toString()
);
