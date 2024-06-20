<script lang="ts">
	import { addToast } from '$lib/stores';
	import TreeWrapper from '../lib/components/treeWrapper.svelte';

	import { apiService } from '$lib/requests';
	import { onMount } from 'svelte';

	let info: any | undefined;
	onMount(async () => {
		try {
			const res = await apiService.getInfo();
			info = res.data;
		} catch (error: any) {
			addToast({message: `Failed fetching the info. ${error.message ? error.message: ""}`})
		}
	});
</script>

<div>
	<TreeWrapper data={info}></TreeWrapper>
</div>
