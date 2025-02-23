<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { config, preferences } from '$lib/stores';
	import { infoToast } from '$lib/toastStore';
	import type { IConfig, IUserPreferences } from '$lib/types';
	import { delay, getLocalStorageConfig } from '$lib/util';
	import { onMount } from 'svelte';

	const defaultPrefs: IUserPreferences = {
		loadParentInfo: false
	};

	onMount(async () => {
		const preferencesStr = localStorage.getItem('preferences');
		if (!preferencesStr) {
			localStorage.setItem('preferences', JSON.stringify(defaultPrefs, undefined, 2));
			preferences.set(defaultPrefs)
		} else {
			preferences.set(JSON.parse(preferencesStr))
		}
		console.log(preferencesStr);
	});
</script>
