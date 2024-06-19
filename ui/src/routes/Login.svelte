<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { userToken } from '$lib/stores';
	import { onMount } from 'svelte';

	onMount(() => {
		userToken.subscribe((v) => {
			if (!v) {
				const path = $page.url.pathname;
				if (path != '/login') goto(`/login?source=${path}`);
			}
		});
	});
</script>
