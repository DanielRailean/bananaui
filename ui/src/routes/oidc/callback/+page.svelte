<script lang="ts">
	import { userToken } from '$lib/stores';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	onMount(() => {
		if ($page.url.toString().includes('callback#')) {
			goto($page.url.toString().replace('#', '?'));
		}
	});

	page.subscribe((v) => {
		const token = v.url.searchParams.get('id_token');
		const state = v.url.searchParams.get('state');
		if (token) {
			userToken.set(token);
			if (state) {
				goto(state);
			}
		}
	});
</script>
