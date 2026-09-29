<script lang="ts">
	import {
		CheckCircleSolid,
		ExclamationCircleSolid,
		InfoCircleSolid,
		CloseOutline
	} from 'flowbite-svelte-icons';
	import { createEventDispatcher, onMount } from 'svelte';
	import { fly } from 'svelte/transition';

	const dispatch = createEventDispatcher();

	export let type = 'error';
	export let dismissible = true;
	export let timeout = 3500;

	let progress = 100;
	let intervalId: ReturnType<typeof setInterval>;

	onMount(() => {
		if (timeout > 0) {
			const step = 50;
			const decrement = (step / timeout) * 100;
			intervalId = setInterval(() => {
				progress -= decrement;
				if (progress <= 0) {
					clearInterval(intervalId);
				}
			}, step);
		}
		return () => { if (intervalId) clearInterval(intervalId); };
	});
</script>

<article
	class="relative overflow-hidden glass max-w-[28rem] flex items-center gap-2.5 my-1.5 pl-4 pr-2 py-3 rounded-xl shadow-lg"
	role="alert"
	in:fly={{ x: 80, duration: 200, delay: 50 }}
	out:fly={{ x: 80, duration: 150 }}
>
	<div class="flex-shrink-0">
		{#if type === 'success'}
			<CheckCircleSolid class="w-5 h-5 fill-[var(--success)]" />
		{:else if type === 'error'}
			<ExclamationCircleSolid class="w-5 h-5 fill-[var(--danger)]" />
		{:else}
			<InfoCircleSolid class="w-5 h-5 fill-[var(--accent)]" />
		{/if}
	</div>

	<div class="flex-1 text-sm leading-snug">
		<slot />
	</div>

	{#if dismissible}
		<button class="btn-icon h-7 w-7 flex-shrink-0" on:click={() => dispatch('dismiss')}>
			<CloseOutline size="xs" />
		</button>
	{/if}

	<!-- Progress bar -->
	{#if timeout > 0}
		<div class="absolute bottom-0 left-0 right-0 h-[2px]">
			<div
				class="h-full transition-[width] duration-50 ease-linear {type === 'success' ? 'bg-[var(--success)]' : type === 'error' ? 'bg-[var(--danger)]' : 'bg-[var(--accent)]'}"
				style="width: {progress}%; opacity: 0.6;"
			></div>
		</div>
	{/if}
</article>
