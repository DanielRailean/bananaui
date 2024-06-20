<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { config, userToken } from '$lib/stores';
	import { onMount } from 'svelte';

	onMount(() => {
		config.subscribe((v) => {
			if (v && v.auth.enabled && !$userToken) {
				const path = $page.url.pathname;
				if (path != '/login') goto(`/login?source=${path}`);
			}
		});
	});
</script>
