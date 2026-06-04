import { writable, type Writable } from 'svelte/store';
import type { IToast } from './types';
import { DateTime } from 'luxon';

export const toasts: Writable<any[]> = writable([]);

const storageKey = 'toast_list'
export let toastList: any[] = JSON.parse(localStorage.getItem(storageKey) ?? "[]")
function pushAndSaveToasts(toast: any)
{
	toast.timestamp = DateTime.now().toISO()
	toastList.push(toast)
	toastList = toastList.slice(-100)
	localStorage.setItem(storageKey, JSON.stringify(toastList));
}

export function clearToasts(){
	toastList = []
	localStorage.setItem(storageKey, JSON.stringify(toastList));
}

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
	pushAndSaveToasts(finalToast)
	// Push the toast to the top of the list of toasts
	toasts.update((all: any) => [finalToast, ...all]);

	// If toast is dismissible, dismiss it after "timeout" amount of time.
	if (finalToast.timeout) setTimeout(() => dismissToast(id), finalToast.timeout);
};

export const dismissToast = (id: number) => {
	toasts.update((all) => all.filter((t) => t.id !== id));
};

export const errorToast = (message: string, dismissible = false, timeout = 3500) =>
	addToast({ message, dismissible, timeout, type: 'error' });
export const infoToast = (message: string, dismissible = false) =>
	addToast({ message, type: 'info', dismissible });
export const confirmToast = (message: string, dismissible = false) =>
	addToast({ message, type: 'success', dismissible });
