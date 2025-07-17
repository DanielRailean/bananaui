<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { get, writable, type Writable } from 'svelte/store';

	const handleChange = (val: any) => {
		dispatch('change', val);
	};

	export let isChecked: Writable<boolean> = writable(false);
	export let title: string | undefined = undefined;
	export let labelLeft: string | undefined = undefined;
	export let labelRight: string | undefined = undefined;

	const dispatch = createEventDispatcher();
	onMount(() => {});
</script>

<!-- https://flowbite.com/docs/forms/toggle/ -->
<div class="flex flex-row items-center">
	{#if labelLeft}
		<span class=" text-sm font-medium text-gray-900 dark:text-gray-300 mr-2">{labelLeft}</span>
	{/if}
	<label class="inline-flex items-center cursor-pointer" {title}>
		<input type="checkbox" checked={$isChecked} on:change={handleChange} class="sr-only peer" />
		<div
			class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:dark:bg-stone-900 after:dark:border-none after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-800"
		></div>
		<!-- <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Toggle me</span> -->
	</label>
	{#if labelRight}
		<!-- content here -->
		<span class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300 mr-2">{labelRight}</span>
	{/if}
</div>
