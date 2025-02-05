<script lang="ts">
	import TreeWrapper from './../../lib/components/treeWrapper.svelte';
	import { onMount } from 'svelte';
	import { userToken } from '$lib/stores';
	import { addToast } from '$lib/toastStore';
	import { DateTime } from 'luxon';
	let token: any = {
		username: '',
		email: '',
		token: ''
	};
	onMount(() => {
		token.token = $userToken;
		const split = $userToken?.split('.');
		if (!split) {
			addToast({ message: 'no token!' });
			return;
		}
		const token_parsed = JSON.parse(atob(split[1]))
		token.token_body = token_parsed;
		token.expires_at = DateTime.fromMillis(token_parsed.exp * 1000).toLocaleString(DateTime.DATETIME_FULL)
		token.username = token_parsed.name;
		token.email = token_parsed.unique_name
	});
</script>

<TreeWrapper data={token} expandLevel={0} />
