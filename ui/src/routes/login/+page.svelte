<script lang="ts">
	import { page } from '$app/stores';
	import { staticConfig } from '$lib/config';
	import { config, userToken } from '$lib/stores';
	import { delay } from '$lib/util';
	import { Button } from 'flowbite-svelte';
	import { onMount } from 'svelte';

	let source = '';

	function getLoginUrl() {
		if (!$config) {
			alert('config not loaded');
			throw new Error('no config loaded');
		}
		return `${$config.oidc.authorizeEndpoint}?client_id=${$config.oidc.clientId}&redirect_uri=${$config.oidc.selfUrl}&scope=${$config.oidc.scope}&response_type=${$config.oidc.responseType}&response_mode=${$config.oidc.response_mode}&state=${source}&nonce=o2rp8ze2jrh`;
	}

	function tryLogin() {
		window.location.assign(getLoginUrl());
	}

	onMount(async () => {
		const sourceParam = $page.url.searchParams.get('source');
		if (sourceParam) {
			source = sourceParam;
		}
		if (staticConfig.autoLogin) {
			await delay(staticConfig.autoLoginDelayMs);
			if (!$userToken) {
				tryLogin();
			}
		}
	});
</script>

<div class="flex items-center justify-center h-full w-full">
	<div class="flex flex-col h-[200px] w-[500px] my-auto">
		<div class="flex flex-row mx-auto items-center">
			<img class="h-16 w-16 mr-4" src="/favicon.png" alt="bananaui logo" />

			<h1 class="text-5xl font-medium">
				{staticConfig.name}
			</h1>
		</div>
		<Button class="my-10 w-24 mx-auto" on:click={tryLogin} color="green">Login</Button>
	</div>
</div>
