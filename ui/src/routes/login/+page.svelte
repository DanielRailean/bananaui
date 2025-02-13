<script lang="ts">
	import { staticConfig } from '$lib/config';
	import { config, userToken } from '$lib/stores';
	import { delay } from '$lib/util';
	import { Button } from 'flowbite-svelte';
	import { onDestroy, onMount } from 'svelte';
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
		const auto = searchParams.get('auto');
		if (sourceParam) {
			source = sourceParam;
		}
		if ($config?.config.oidc?.autoLogin || auto === "true") {
			await delay(staticConfig.autoLoginDelayMs);
			if (!$userToken) {
				tryLogin();
			}
		}
	});
</script>

<div class="flex items-center justify-center h-[80vh] w-full my-auto">
	<div class="flex flex-col items-center w-full">
		<div class="flex flex-row mx-auto items-center">
			<img class="h-16 w-16 mr-4" src={logo} alt="bananaui logo" />

			<h1 class="text-5xl font-medium">
				{staticConfig.name}
			</h1>
		</div>
		<Button class="my-10 h-16 text-xl mx-auto" on:click={tryLogin} color="green">SSO Login</Button>
	</div>
</div>
