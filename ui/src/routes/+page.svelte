<script lang="ts">
	import TreeWrapper from './treeWrapper.svelte';

	import { apiService } from '$lib/requests';
	import { onMount } from 'svelte';

	let info: any | undefined;
	onMount(async () => {
		const res = await apiService.getInfo();
		info = res.data;
	});
</script>


<div class="my-4">
	<TreeWrapper data={info}></TreeWrapper>

</div>
