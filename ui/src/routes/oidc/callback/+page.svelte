<script lang="ts">
	import { userToken } from '$lib/stores';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	let mounted = false;

	page.subscribe((v) => {
		if (!mounted) return;
		const searchParams = new URLSearchParams(window.location.search);
		const token = searchParams.get('id_token');
		const state = searchParams.get('state');
		if (token) {
			userToken.set(token);
			if (state) {
				goto(state);
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
