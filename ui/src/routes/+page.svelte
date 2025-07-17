<script lang="ts">
	import { addToast } from '$lib/toastStore';
	import TreeWrapper from '../lib/components/treeWrapper.svelte';

	import { apiService } from '$lib/requests';
	import { onMount } from 'svelte';
	import Spinner from '$lib/components/Spinner.svelte';

	let info: any | undefined;
	onMount(async () => {
		try {
			const res = await (await apiService()).getInfo();
			
			let infoRaw = res.data;
			const sortedPlugins = Object.entries(infoRaw?.plugins.available_on_server ?? {}).sort((a,b)=>b[1].priority - a[1].priority)
			const plugins = Object.fromEntries(sortedPlugins)
			infoRaw!.plugins.available_on_server = plugins
			info = infoRaw
		} catch (error: any) {
			addToast({ message: `Failed fetching the info. ${error.message ? error.message : ''}` });
		}
	});
</script>

<div>
	<h1 class="text-xl text-center p-2">
		<div class="flex flex-row items-center justify-center">
			{#if info}
				Kong Control-Plane info
			{:else}
				<Spinner text="loading control plane info" />
			{/if}
		</div>
	</h1>

	<TreeWrapper data={info} expandFields={[]}></TreeWrapper>
</div>
