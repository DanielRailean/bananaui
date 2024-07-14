<script lang="ts">
	import { goto } from '$app/navigation';
	import { LOCALSTORAGE_CONFIG_KEY, delay } from '$lib/util';
	import { PaletteOutline, FloppyDiskAltOutline } from 'flowbite-svelte-icons';
	import { config, addToast, infoToast } from '$lib/stores';
	import { Button } from 'flowbite-svelte';
	import type { IConfig } from '$lib/types.ts';
	import { onMount } from 'svelte';
	import { base } from '$app/paths';

	const defaultConfig: IConfig = {
		auth: {
			enabled: false
		},
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
		if ($config && $config.source == 'remote') {
			goto(base);
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

<div class="mx-4 mb-3">
	<div class="my-5">
		<h2 class="text-2xl">Settings</h2>
		<p>you can change the settings here, if running in static mode.</p>
		<p>the settings are saved in the browser's Local storage</p>
		<div class="mt-2">
			<Button class="" on:click={writeConfig}>
				<FloppyDiskAltOutline class="mr-1" />

				save
			</Button>
			<Button class="ml-3" on:click={formatConfig} color="blue">
				<PaletteOutline class="mr-1" />
				format and validate JSON
			</Button>
		</div>
	</div>
	<textarea class="w-full min-h-72 dark:bg-slate-900" name="" id="" bind:value={editableConfig}
	></textarea>
</div>
