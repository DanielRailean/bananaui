import { writable, type Writable } from 'svelte/store';

export const isDark = writable(0);
export const userToken: Writable<string | undefined> = writable(undefined);
