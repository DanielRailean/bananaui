import { writable, type Writable } from 'svelte/store';
import type { IConfig, IConfigWrap, IToast } from './types';
import { DateTime } from 'luxon';

export const isDark = writable(0);
export const userToken: Writable<string | undefined> = writable(undefined);
export const config: Writable<IConfigWrap | undefined | null> = writable(undefined);
export const triggerPageUpdate = writable(DateTime.now());
export const toasts: Writable<any[]> = writable([]);

export const addToast = (toast: IToast) => {
	// Create a unique ID so we can easily find/remove it
	// if it is dismissible/has a timeout.
	const id = Math.floor(Math.random() * 10000);

	// Setup some sensible defaults for a toast.
	const defaults = {
		id,
		type: 'error',
		dismissible: true,
		timeout: 3500
	} as any;

	const finalToast = { ...defaults, ...toast };
	// Push the toast to the top of the list of toasts
	toasts.update((all: any) => [finalToast, ...all]);

	// If toast is dismissible, dismiss it after "timeout" amount of time.
	if (finalToast.timeout) setTimeout(() => dismissToast(id), finalToast.timeout);
};

export const dismissToast = (id: number) => {
	toasts.update((all) => all.filter((t) => t.id !== id));
};

export const errorToast = (message: string) => addToast({ message, type: 'error' });
export const infoToast = (message: string) => addToast({ message, type: 'info' });
