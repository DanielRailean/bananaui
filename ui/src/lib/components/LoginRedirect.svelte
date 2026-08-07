<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import { config, userToken } from '$lib/stores';
	import { onMount, onDestroy } from 'svelte';
	import { get } from 'svelte/store';
	import { DateTime } from 'luxon';

	function checkTokenExpiry() {
		const token = get(userToken);
		if (token && token.expires > 0 && DateTime.now().toUnixInteger() > token.expires) {
			userToken.set(undefined);
			const path = $page.url.pathname;
			const search = $page.url.search;
			goto(`${base}/login?auto=true&source=${btoa(path + search)}`);
		}
	}

	onMount(() => {
		window.addEventListener('click', checkTokenExpiry);
		window.addEventListener('keydown', checkTokenExpiry);

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

	onDestroy(() => {
		if (typeof window !== 'undefined') {
			window.removeEventListener('click', checkTokenExpiry);
			window.removeEventListener('keydown', checkTokenExpiry);
		}
	});
</script>
