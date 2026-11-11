<script lang="ts">
	import { userToken } from '$lib/stores';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { base } from '$app/paths';
	import { DateTime } from 'luxon';

	let mounted = false;

	page.subscribe((v) => {
		if (!mounted) return;
		const searchParams = new URLSearchParams(window.location.search);
		const token = searchParams.get('id_token');
		const state = searchParams.get('state');
		if (token) {
			// re-login on the next click once the token is 59 minutes old
			userToken.set({token, expires: DateTime.now().plus({minutes: 59}).toUnixInteger()});
			if (state) {
				const target = atob(state);
				goto(target);
			} else {
				goto(`${base}/`);
			}
		}
	});

	onMount(() => {
		mounted = true;
		if ($page.url.toString().includes('callback#')) {
			goto($page.url.toString().replace('#', '?'));
		}
	});
</script>
