import { writable } from 'svelte/store';

interface ConfirmState {
	open: boolean;
	title: string;
	message: string;
	confirmText: string;
	cancelText: string;
	variant: 'danger' | 'warning' | 'info';
	resolve: ((value: boolean) => void) | null;
}

const defaults: ConfirmState = {
	open: false,
	title: 'Are you sure?',
	message: '',
	confirmText: 'Confirm',
	cancelText: 'Cancel',
	variant: 'danger',
	resolve: null
};

export const confirmState = writable<ConfirmState>({ ...defaults });

export interface ConfirmOptions {
	title?: string;
	message: string;
	confirmText?: string;
	cancelText?: string;
	variant?: 'danger' | 'warning' | 'info';
}

export function confirm(options: ConfirmOptions | string): Promise<boolean> {
	const opts: ConfirmOptions = typeof options === 'string' ? { message: options } : options;
	return new Promise((resolve) => {
		confirmState.set({
			open: true,
			title: opts.title ?? defaults.title,
			message: opts.message,
			confirmText: opts.confirmText ?? defaults.confirmText,
			cancelText: opts.cancelText ?? defaults.cancelText,
			variant: opts.variant ?? defaults.variant,
			resolve
		});
	});
}
