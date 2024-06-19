<script lang="ts">
	import TreeWrapper from '../lib/components/treeWrapper.svelte';

	import { apiService } from '$lib/requests';
	import { onMount } from 'svelte';

	let info: any | undefined;
	onMount(async () => {
		const res = await apiService.getInfo();
		info = res.data;
	});
</script>

<div>
	<TreeWrapper data={info}></TreeWrapper>
</div>
