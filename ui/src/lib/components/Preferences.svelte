<script lang="ts">
	import {
		getPreferencesAsJson,
		getPreferencesObject,
		preferences,
		savePreferences,
		setPreferences
	} from '$lib/stores';
	import { onMount } from 'svelte';

	const defaultPref: { [key: string]: any } = {
		version: 3,
		loadParentInfo: false,
		paginationSizeUi: 20,
		paginationSizeApi: 1000,
		showPluginOrder: false,
		useNewSearch: false
	};

	const localCacheKey = 'preferences';
	onMount(async () => {
		let prefObject: { [key: string]: any } = {};
		let localStoragePref = localStorage.getItem(localCacheKey);
		if (localStoragePref) {
			try {
				prefObject = JSON.parse(localStoragePref);
			} catch (error) {
				prefObject = JSON.parse(JSON.stringify(defaultPref));
			}
		}
		if (!prefObject.version || prefObject.version < defaultPref.version) {
			for (const key of Object.keys(prefObject)) {
				if (!defaultPref[key]) {
					prefObject[key] = undefined;
				}
			}
			for (const key of Object.keys(defaultPref)) {
				if (!prefObject[key] || typeof prefObject[key] != typeof defaultPref[key]) {
					prefObject[key] = defaultPref[key];
				}
			}
			(prefObject.version = defaultPref.version),
				localStorage.setItem(localCacheKey, JSON.stringify(prefObject));
		}
		setPreferences(getPreferencesObject(prefObject));
		if (preferences) {
			for (const key of Object.keys(preferences)) {
				preferences[key].subscribe((v) => {
					savePreferences();
				});
			}
		}
	});
</script>
