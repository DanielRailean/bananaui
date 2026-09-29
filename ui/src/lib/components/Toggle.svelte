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

<div class="flex flex-row items-center gap-2">
	{#if labelLeft}
		<span class="text-sm font-medium text-[var(--text-secondary)] whitespace-nowrap">{labelLeft}</span>
	{/if}
	<label class="inline-flex items-center cursor-pointer" {title}>
		<input type="checkbox" checked={$isChecked} on:click={handleChange} class="sr-only peer" />
		<div
			class="toggle-track peer peer-checked:bg-[var(--accent)] peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--accent)] peer-focus-visible:ring-offset-2"
		>
			<div class="toggle-knob" class:translate-x-4={$isChecked}></div>
		</div>
	</label>
	{#if labelRight}
		<span class="text-sm font-medium text-[var(--text-secondary)] whitespace-nowrap">{labelRight}</span>
	{/if}
</div>

<style lang="postcss">
	.toggle-track {
		@apply relative w-9 h-5 rounded-full transition-colors duration-200 ease-in-out;
		background: var(--text-tertiary);
	}
	.toggle-knob {
		@apply absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white
			shadow-sm transition-transform duration-200 ease-in-out;
	}
</style>
