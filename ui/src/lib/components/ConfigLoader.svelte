<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { config, userToken, signalAuthReady } from '$lib/stores';
	import { infoToast } from '$lib/toastStore';
	import type { IConfig } from '$lib/types';
	import { delay, getLocalStorageConfig, setLocalStorageConfig } from '$lib/util';
	import { onMount } from 'svelte';

	function triggerLogin(configRef: any, source: 'local' | 'remote' = 'local') {
		if ($userToken && $userToken.expires > 0) {
			return;
		}
		userToken.set(undefined);
		config.set({ config: configRef, source });
	}

	async function checkCookieAuth(appConfigRef: any, source: 'local' | 'remote' = 'local') {
		try {
			const ok = await fetch(`${appConfigRef.kongApi.endpoint}`);
			if (!ok.ok) {
				triggerLogin(appConfigRef, source);
			}
		} catch (error) {
			console.log(error);
			triggerLogin(appConfigRef, source);
		}
	}

	onMount(async () => {
		userToken.set({
			token: 'head.eyJ1cG4iOiJjb29raWUgYmFzZWQgYXV0aGVudGljYXRpb24gdXNlZCJ9.sig',
			expires: -1
		});
		let localConfig = getLocalStorageConfig();
		if (localConfig) {
			config.set({ config: localConfig, source: 'local' });
		}
		setTimeout(async () => {
			const res = await fetch(`${base}/config`);
			if (res.ok) {
				localConfig = (await res.json()) as IConfig;
				if (localConfig) {
					config.set({ config: localConfig, source: 'remote' });
					setLocalStorageConfig(localConfig);
				}
			} else {
				config.set(null);
				// addToast({message: "failed to fetch a default config, trying a local one!"})
				const localConfig = getLocalStorageConfig();
				if (localConfig) {
					// infoToast("local config loaded!")
					config.set({ config: localConfig, source: 'local' });
				} else {
					await delay(1000);
					infoToast('app config not found, please create one to use the app!');
					goto(`${base}/settings`);
				}
			}
			const source = localConfig ? (res.ok ? 'remote' : 'local') : 'local';
			await checkCookieAuth(localConfig, source as 'local' | 'remote');
			signalAuthReady();
		}, 100);
	});
</script>
