<script lang="ts">
	import { staticConfig } from '$lib/config';
	import { config, userToken } from '$lib/stores';
	import { delay } from '$lib/util';
	import { Button } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import logo from '$lib/assets/favicon.png';


	let source = '';

	function getLoginUrl() {
		const oidcConfig = $config?.config.oidc;
		if (!oidcConfig) {
			alert('config not loaded');
			throw new Error('no config loaded');
		}
		return `${oidcConfig.authorizeEndpoint}?client_id=${oidcConfig.clientId}&redirect_uri=${oidcConfig.selfUrl}&scope=${oidcConfig.scope}&response_type=${oidcConfig.responseType}&response_mode=${oidcConfig.response_mode}&state=${source}&nonce=o2rp8ze2jrh`;
	}

	function tryLogin() {
		window.location.assign(getLoginUrl());
	}

	onMount(async () => {
		const searchParams = new URLSearchParams(window.location.search);
		const sourceParam = searchParams.get('source');
		if (sourceParam) {
			source = sourceParam;
		}
		if ($config?.config.auth.autoLogin) {
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
			<img class="h-16 w-16 mr-4" src={logo} alt="bananaui logo" />

			<h1 class="text-5xl font-medium">
				{staticConfig.name}
			</h1>
		</div>
		<Button class="my-10 w-24 mx-auto" on:click={tryLogin} color="green">Login</Button>
	</div>
</div>
