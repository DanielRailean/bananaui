<script lang="ts">
	import Toggle from './../lib/components/Toggle.svelte';
	import { addToast } from '$lib/toastStore';
	import TreeWrapper from '../lib/components/treeWrapper.svelte';

	import { apiService } from '$lib/requests';
	import { onMount } from 'svelte';

	let info: any | undefined;
	onMount(async () => {
		try {
			const res = await (await apiService()).getInfo();
			info = res.data;
		} catch (error: any) {
			addToast({ message: `Failed fetching the info. ${error.message ? error.message : ''}` });
		}
	});
</script>

<div>
	<h1 class="text-xl text-center p-2">
		{info ? 'Kong Control-Plane info' : 'Loading Kong Control-Plane info'}
	</h1>

	<TreeWrapper data={info} expandFields={[]}></TreeWrapper>
</div>
