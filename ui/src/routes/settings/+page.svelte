<script lang="ts">
	import { goto } from '$app/navigation';
	import { LOCALSTORAGE_CONFIG_KEY, delay } from '$lib/util';
	import { PaletteOutline, FloppyDiskAltOutline } from 'flowbite-svelte-icons';
	import { addToast, infoToast } from '$lib/toastStore';
	import type { IConfig } from '$lib/types.ts';
	import { onMount } from 'svelte';
	import { base } from '$app/paths';
	import { config } from '$lib/stores';

	const defaultConfig: IConfig = {
		kongApi: {
			endpoint: 'http://localhost:8001',
			requestHeaders: {
				'header-key': 'header-value'
			}
		}
	};

	let editableConfig = '';

	onMount(async () => {
		while ($config === undefined) {
			await delay(50);
		}
		if ($config && $config.source === 'remote') {
			infoToast('settings not available if a remote config is present!');
			goto(`${base}/`);
			return;
		}
		const localSettings = localStorage.getItem(LOCALSTORAGE_CONFIG_KEY);
		if (localSettings) {
			editableConfig = localSettings;
		} else {
			infoToast('loaded a config template!');
			editableConfig = JSON.stringify(defaultConfig, undefined, 2);
		}
	});

	function format(value: string) {
		let parsed: any | undefined;
		try {
			parsed = JSON.parse(value);
		} catch (err: any) {
			addToast({ message: `Failed to parse JSON. ${err.message}` });
			return;
		}
		addToast({ message: `ok`, type: 'info' });
		return JSON.stringify(parsed, undefined, 2);
	}
	function formatConfig() {
		const res = format(editableConfig);
		if (res) {
			editableConfig = res;
		}
	}
	function writeConfig() {
		localStorage.setItem(LOCALSTORAGE_CONFIG_KEY, editableConfig);
		config.set({ config: JSON.parse(editableConfig), source: 'local' });
		addToast({ message: 'config successfully created!', type: 'info' });
	}
</script>

<div>
	<div class="flex items-center justify-between mb-6">
		<div>
			<h1 class="text-2xl font-semibold">Settings</h1>
			<p class="text-sm text-[var(--text-secondary)]">Configuration JSON — saved in browser Local Storage.</p>
		</div>
		<div class="flex items-center gap-2">
			<button class="btn-accent" on:click={formatConfig}>
				<PaletteOutline size="sm" />Format
			</button>
			<button class="btn-success" on:click={writeConfig}>
				<FloppyDiskAltOutline size="sm" />Save
			</button>
		</div>
	</div>
	<textarea
		class="w-full min-h-96 rounded-xl input-field h-auto py-3 font-mono text-sm"
		bind:value={editableConfig}
	></textarea>
</div>
