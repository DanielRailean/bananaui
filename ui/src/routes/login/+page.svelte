<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { userToken } from '$lib/stores';
	import { Button } from 'flowbite-svelte';
	import { onMount } from 'svelte';

	let source = '';
	interface BananUiConfig {
		oidc: Oidc;
	}

	interface Oidc {
		authorizeEndpoint: string;
		clientId: string;
		selfUrl: string;
		scope: string;
		responseType: string;
		response_mode: string;
		state: string;
	}

	let config: BananUiConfig;
	function getLoginUrl() {
		return `${config.oidc.authorizeEndpoint}?client_id=${config.oidc.clientId}&redirect_uri=${config.oidc.selfUrl}&scope=${config.oidc.scope}&response_type=${config.oidc.responseType}&response_mode=${config.oidc.response_mode}&state=${config.oidc.state}&nonce=o2rp8ze2jrh`;
	}

	function tryLogin() {
		window.location.assign(getLoginUrl());
	}

	onMount(async () => {
		const res = await fetch('/config');
		if (res.ok) {
			config = (await res.json()) as BananUiConfig;
			config.oidc.state = source;
			// console.log(config);
		}
		page.subscribe((v) => {
			const sourceParam = v.url.searchParams.get('source');
			if (sourceParam) {
				source = sourceParam;
				if (config) {
					config.oidc.state = sourceParam;
				}
			}
		});
	});
</script>

<div class="flex items-center justify-center">
	<Button on:click={tryLogin} color="alternative">Login</Button>
</div>
