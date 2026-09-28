<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const eventdispatch = createEventDispatcher();
	export let item: any = {};
	export let field = '';
</script>

<div class="flex flex-row flex-wrap items-center gap-1.5">
	{#each item[field] as row}
		{#if field === 'methods'}
			<span
				class="http-method method-{row.toLowerCase()} cursor-pointer select-none"
				title="double-click to copy"
				on:dblclick|stopPropagation|preventDefault={() => eventdispatch('copy', { value: row })}
			>{row}</span>
		{:else if field === 'protocols'}
			<span
				class="http-method protocol-{row.toLowerCase()} cursor-pointer select-none"
				title="double-click to copy"
				on:dblclick|stopPropagation|preventDefault={() => eventdispatch('copy', { value: row })}
			>{row}</span>
		{:else if typeof row === 'string' && row.startsWith('/')}
			<code
				class="px-2 py-0.5 rounded-md text-[12px] font-mono bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 cursor-pointer select-none hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors"
				title="double-click to copy"
				on:dblclick|stopPropagation|preventDefault={() => eventdispatch('copy', { value: row })}
			>{row}</code>
		{:else}
			<span
				class="px-2 py-0.5 rounded-md text-[12px] bg-black/[0.04] dark:bg-white/[0.07] text-[var(--text-primary)] cursor-pointer select-none hover:bg-black/[0.08] dark:hover:bg-white/[0.12] transition-colors"
				title="double-click to copy"
				on:dblclick|stopPropagation|preventDefault={() => eventdispatch('copy', { value: row })}
			>{row}</span>
		{/if}
	{/each}
</div>
