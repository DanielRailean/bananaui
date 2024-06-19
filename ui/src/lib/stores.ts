import { writable, type Writable } from 'svelte/store';
import type { IConfig } from './types';

export const isDark = writable(0);
export const userToken: Writable<string | undefined> = writable(undefined);
export const config: Writable<IConfig | undefined> = writable(undefined);
