<script lang="ts">
	import { preferences } from '$lib/stores';
	import { onMount } from 'svelte';

	const defaultPrefs: {[key:string]:any} = {
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
	});
</script>
