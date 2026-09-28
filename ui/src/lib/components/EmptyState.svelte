<script lang="ts">
	export let title = 'Nothing here yet';
	export let description = '';
	export let actionLabel = '';
	export let actionHref = '';

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
</script>

<div class="flex flex-col items-center justify-center py-16 px-4">
	<div class="h-12 w-12 rounded-full bg-[var(--accent)]/10 flex items-center justify-center mb-4">
		<svg class="w-6 h-6 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
			<path stroke-linecap="round" stroke-linejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
		</svg>
	</div>
	<h3 class="text-base font-semibold text-[var(--text-primary)] mb-1">{title}</h3>
	{#if description}
		<p class="text-sm text-[var(--text-secondary)] mb-4 text-center max-w-xs">{description}</p>
	{/if}
	{#if actionLabel}
		{#if actionHref}
			<a href={actionHref} class="btn-accent">{actionLabel}</a>
		{:else}
			<button class="btn-accent" on:click={() => dispatch('action')}>{actionLabel}</button>
		{/if}
	{/if}
</div>
