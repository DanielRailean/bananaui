<script lang="ts">
	import { staticConfig } from '$lib/config';
	import { config, userToken } from '$lib/stores';
	import { delay } from '$lib/util';
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

<div class="flex items-center justify-center min-h-[80vh] w-full">
	<div class="glass rounded-2xl p-10 flex flex-col items-center max-w-sm w-full">
		<img class="h-14 w-14 mb-4" src={logo} alt="bananaui logo" />
		<h1 class="text-2xl font-semibold tracking-tight mb-1">
			{staticConfig.name}
		</h1>
		<p class="text-sm text-[var(--text-secondary)] mb-8">Sign in to manage your gateway</p>
		<button class="btn-accent w-full h-12 text-base rounded-xl justify-center" on:click={tryLogin}>SSO Login</button>
	</div>
</div>
