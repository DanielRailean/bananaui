<script lang="ts">
	import { goto } from '$app/navigation';
	import { addToast, config, infoToast } from '$lib/stores';
	import type { IConfig } from '$lib/types';
	import { delay, getLocalStorageConfig } from '$lib/util';
	import { onMount } from 'svelte';

	onMount(async () => {
		const res = await fetch('/config');
		if (res.ok) {
			const appConfig = (await res.json()) as IConfig;
			if (appConfig) {
				config.set({ config: appConfig, source: 'remote' });
			}
		} else {
			// addToast({message: "failed to fetch a default config, trying a local one!"})
			const localConfig = getLocalStorageConfig();
			if (localConfig) {
				// infoToast("local config loaded!")
				config.set({ config: localConfig, source: 'local' });
			} else {
				await delay(1000);
				infoToast('app config not found, please create one to use the app!');
				goto('/settings');
			}
		}
	});
</script>
