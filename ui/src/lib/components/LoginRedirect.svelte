<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import { config, userToken } from '$lib/stores';
	import { onMount } from 'svelte';

	onMount(() => {
		config.subscribe((v) => {
			if (v && v.config.oidc?.enabled && !$userToken) {
				const path = $page.url.pathname;
				const search = $page.url.search;
				if (!path.includes('/login')) {
					goto(`${base}/login?source=${btoa(path + search)}`);
				}
			}
		});
	});
</script>
