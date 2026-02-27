<script lang="ts">
	import TreeWrapper from './../../lib/components/treeWrapper.svelte';
	import { onMount } from 'svelte';
	import { config, userToken } from '$lib/stores';
	import { addToast, confirmToast, infoToast } from '$lib/toastStore';
	import { DateTime } from 'luxon';
	import { Button } from 'flowbite-svelte';
	import { writeToClipboard } from '$lib/util';
	let info: any = {
		username: '',
		email: '',
		payload: {}
	};

	onMount(() => {
		const split = $userToken?.token.split('.');
		if (!split) {
			addToast({ message: 'no token!' });
			return;
		}
		const token_parsed = JSON.parse(atob(split[1]));
		info.payload = token_parsed;
		info.username = token_parsed.name;
		info.email = token_parsed.unique_name;
	});
</script>

<div class="w-full">
	<TreeWrapper data={info} expandLevel={2} />
	<div class="flex flex-row items-center">
		<Button
			class="m-2"
			disabled={$userToken?.expires == -1}
			on:click={() => {
				writeToClipboard($userToken?.token ?? '', () => {
					confirmToast(
						`copied! expires at ${DateTime.fromMillis(info.payload.exp * 1000).toFormat('T')}`
					);
				});
			}}
			>copy personal API token
		</Button>
		<Button
			class="m-2"
			disabled={$userToken?.expires != -1}
			on:click={() => {
				userToken.set(undefined);
				config.set($config);
			}}>login again</Button
		>
	</div>
</div>
