<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import { config, userToken } from '$lib/stores';
	import { onMount } from 'svelte';

	onMount(() => {
		config.subscribe((v) => {
			if (v && v.config.auth.enabled && !$userToken) {
				const path = $page.url.pathname;
				if (!path.includes('/login')) goto(`${base}/login?source=${path}`);
			}
		});
	});
</script>
