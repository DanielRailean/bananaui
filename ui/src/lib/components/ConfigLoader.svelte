<script lang="ts">
	import { config } from '$lib/stores';
	import type { IConfig } from '$lib/types';
	import { onMount } from 'svelte';

	onMount(async () => {
		const res = await fetch('/config');
		if (res.ok) {
			const appConfig = (await res.json()) as IConfig;
			if (appConfig) {
				config.set(appConfig);
			}
		}
	});
</script>
