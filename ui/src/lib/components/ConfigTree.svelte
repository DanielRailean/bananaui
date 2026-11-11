<script lang="ts">
	import { writeToClipboard } from '$lib/util';

	export let value: any;
	export let depth = 0;

	const isObject = (v: any) => v !== null && typeof v === 'object';
	const asText = (v: any) => (typeof v === 'string' ? v : JSON.stringify(v, null, 2));

	function valueClass(v: any) {
		if (v === null) return 'text-[var(--text-tertiary)] italic';
		if (typeof v === 'string') return 'text-emerald-700 dark:text-emerald-400';
		if (typeof v === 'number') return 'text-sky-700 dark:text-sky-400';
		if (typeof v === 'boolean') return 'text-amber-700 dark:text-amber-400';
		return '';
	}

	$: entries = isObject(value)
		? Array.isArray(value)
			? value.map((v: any, i: number) => [String(i), v] as [string, any])
			: Object.entries(value)
		: [];
</script>

<div class="font-mono text-[13px] leading-6 {depth > 0 ? (Array.isArray(value) ? 'pl-4' : 'pl-4 border-l border-[var(--glass-border)]') : ''}">
	{#each entries as [key, val]}
		<div class={isObject(val) && !Array.isArray(value) ? '' : 'flex flex-row gap-2 items-baseline'}>
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			{#if Array.isArray(value)}
				<span class="select-none text-[var(--text-tertiary)] shrink-0">-</span>
			{:else}
			<span
				class="cursor-pointer select-none text-[var(--accent)] hover:underline shrink-0"
				title="double-click to copy key '{key}'"
				on:dblclick|stopPropagation={() => writeToClipboard(key)}
			>{key}:</span>
			{/if}
			{#if isObject(val)}
				{#if (Array.isArray(val) ? val.length : Object.keys(val).length) === 0}
					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<span
						class="cursor-pointer select-none text-[var(--text-tertiary)]"
						title="double-click to copy value"
						on:dblclick|stopPropagation={() => writeToClipboard(asText(val))}
					>{Array.isArray(val) ? '[]' : '{}'}</span>
				{:else}
					<svelte:self value={val} depth={Array.isArray(value) ? 0 : depth + 1} />
				{/if}
			{:else}
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<span
					class="cursor-pointer select-none break-all hover:underline {valueClass(val)}"
					title="double-click to copy value"
					on:dblclick|stopPropagation={() => writeToClipboard(asText(val))}
				>{typeof val === 'string' ? `"${val}"` : String(val)}</span>
			{/if}
		</div>
	{/each}
</div>
