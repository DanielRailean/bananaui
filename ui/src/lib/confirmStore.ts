import { writable } from 'svelte/store';

export interface FieldChange {
	field: string;
	oldValue: string;
	newValue: string;
}

interface ConfirmState {
	open: boolean;
	title: string;
	message: string;
	confirmText: string;
	cancelText: string;
	variant: 'danger' | 'warning' | 'info';
	changes: FieldChange[];
	resolve: ((value: boolean) => void) | null;
}

const defaults: ConfirmState = {
	open: false,
	title: 'Are you sure?',
	message: '',
	confirmText: 'Confirm',
	cancelText: 'Cancel',
	variant: 'danger',
	changes: [],
	resolve: null
};

export const confirmState = writable<ConfirmState>({ ...defaults });

export interface ConfirmOptions {
	title?: string;
	message: string;
	confirmText?: string;
	cancelText?: string;
	variant?: 'danger' | 'warning' | 'info';
	changes?: FieldChange[];
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
			changes: opts.changes ?? [],
			resolve
		});
	});
}
