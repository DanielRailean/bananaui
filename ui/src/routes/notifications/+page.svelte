<script lang="ts">
	import { toastList } from "$lib/toastStore";
	import { onMount } from "svelte";

	onMount(() => {});
</script>

<div class="w-full p-4">
	<h1 class="pb-4 pl-2 text-xl">Notifications list</h1>
	{#each toastList.reverse() as item}
		<p class="p-1 
		{item.type == "info" ? "text-blue-600 dark:text-indigo-400": ""}
		{item.type == "success" ? "text-emerald-600 dark:text-emerald-400": ""}
		{item.type == "error" ? "text-rose-600 dark:text-rose-500": ""}
		">
			{JSON.stringify({ message: item.message, type: item.type, timestamp: item.timestamp })}
		</p>
	{/each}
</div>
