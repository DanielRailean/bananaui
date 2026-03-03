<script lang="ts">
	import TreeWrapper from './../../lib/components/treeWrapper.svelte';
	import { toastList } from "$lib/toastStore";
	import { onMount } from "svelte";

	let localToasts:any[] = []
	onMount(() => {
		localToasts = toastList.map(item=>{
			return { message: item.message, type: item.type, timestamp: item.timestamp }
		})
	});
</script>

<div class="w-full p-4">
	<h1 class="pb-4 pl-2 text-xl">Notifications list</h1>
	<TreeWrapper expandLevel={1} data={{
		errors : localToasts.filter(i=>i.type =="error"),
		info : localToasts.filter(i=>i.type =="error"),
		success : localToasts.filter(i=>i.type =="success"),
	}}/>
</div>
