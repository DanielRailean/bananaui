<script lang="ts">
	import {
		getPreferencesAsJson,
		getPreferencesFromJson,
		preferences,
		savePreferences,
		setPreferences
	} from '$lib/stores';
	import { onMount } from 'svelte';

	const defaultPrefs: { [key: string]: any } = {
		version: 1,
		loadParentInfo: false,
		paginationSizeUi: 20,
		paginationSizeApi: 1000,
		cachedEntities: ["services", "plugins", "routes", "consumers"]
	};

	onMount(async () => {
		let preferencesStr = localStorage.getItem('preferences');
		if (!preferencesStr) {
			preferencesStr = JSON.stringify(defaultPrefs);
		}
		setPreferences(getPreferencesFromJson(preferencesStr));
		if (preferences) {
			for (const key of Object.keys(preferences)) {
				preferences[key].subscribe((v) => {
					savePreferences()
				});
			}
		}
	});
</script>
