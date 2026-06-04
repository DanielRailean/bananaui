<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const eventdispatch = createEventDispatcher();
	export let item: any = {};
	export let field = '';
</script>

<div
	class="flex flex-row flex-wrap justify-start max-w-[650px] {field == 'methods'
		? `max-w-[200px]`
		: 'max-w-[650px]'}"
>
	{#each item[field] as row, index}
		<p
			class="text-xs cursor-pointer select-none p-1 border dark:border-stone-600 m-1 hover:dark:dark:bg-stone-800 hover:bg-slate-50 {field ==
			'methods'
				? `http-method method-${item[field][index].toLowerCase()}`
				: ''}"
			title="double-click to copy '{item[field][index]}'"
			on:dblclick|stopPropagation|preventDefault={() => {
				eventdispatch('copy', { value: item[field][index] });
			}}
		>
			{row}
		</p>
	{/each}
</div>
