<script lang="ts">
	import TreeWrapper from './../../lib/components/treeWrapper.svelte';
	import { onMount } from 'svelte';
	import { userToken } from '$lib/stores';
	import { addToast, confirmToast, infoToast } from '$lib/toastStore';
	import { DateTime, Duration } from 'luxon';
	import { Button } from 'flowbite-svelte';
	import { writeToClipboard } from '$lib/util';
	let token: any = {
		username: '',
		email: '',
		token_body : {}
	};
	let expiresMinutes = 0
	onMount(() => {
		const split = $userToken?.token.split('.');
		if (!split) {
			addToast({ message: 'no token!' });
			return;
		}
		const token_parsed = JSON.parse(atob(split[1]))
		token.token_body = token_parsed;
		token.username = token_parsed.name;
		token.email = token_parsed.unique_name
		expiresMinutes = DateTime.now()
			.diff(DateTime.fromMillis(token.token_body.exp * 1000)).toMillis() / 1000 / 60 * -1
		expiresMinutes = Math.floor(expiresMinutes - 1 )
	});
</script>

<div class="w-full">
	<TreeWrapper data={token} expandLevel={0} />
	<div class="flex flex-row items-center">
		<Button class="m-2" on:click={() => {writeToClipboard($userToken?.token ?? "", ()=> {
			confirmToast(`copied! expires in ${expiresMinutes} minutes`)
		})}}>copy personal API token </Button>
	</div>
</div>
