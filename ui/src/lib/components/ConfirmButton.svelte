<script lang="ts">
	import { createEventDispatcher, onDestroy } from 'svelte';

	export let confirmText = 'Confirm';
	export let timeoutMs = 3000;
	let className = '';
	export { className as class };

	const dispatch = createEventDispatcher();
	let armed = false;
	let timer: ReturnType<typeof setTimeout> | undefined;

	function click() {
		if (!armed) {
			armed = true;
			timer = setTimeout(() => (armed = false), timeoutMs);
			return;
		}
		clearTimeout(timer);
		armed = false;
		dispatch('confirm');
	}

	onDestroy(() => clearTimeout(timer));
</script>

<button class="{className} {armed ? '!bg-[var(--danger)] !text-white font-semibold' : ''}" on:click={click} on:blur={() => (armed = false)}>
	{#if armed}
		{confirmText}
	{:else}
		<slot />
	{/if}
</button>
