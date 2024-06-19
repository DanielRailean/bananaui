<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { config, userToken } from '$lib/stores';
	import { onMount } from 'svelte';

	onMount(() => {
		userToken.subscribe((v) => {
			if (!v && $config?.auth.enabled) {
				const path = $page.url.pathname;
				if (path != '/login') goto(`/login?source=${path}`);
			}
		});
	});
</script>
