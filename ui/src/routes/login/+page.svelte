<script lang="ts">
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
		await delay(2000);
		if (!$userToken) {
			tryLogin();
		}
	});
</script>

<div class="flex items-center justify-center">
	<Button on:click={tryLogin} color="alternative">Login</Button>
</div>
