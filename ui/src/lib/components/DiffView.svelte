<script lang="ts">
	export let oldText = '';
	export let newText = '';

	interface DiffLine {
		type: 'same' | 'added' | 'removed';
		text: string;
	}

	$: lines = computeDiff(oldText, newText);

	function computeDiff(a: string, b: string): DiffLine[] {
		const oldLines = a.split('\n');
		const newLines = b.split('\n');
		const result: DiffLine[] = [];
		const max = Math.max(oldLines.length, newLines.length);

		for (let i = 0; i < max; i++) {
			const ol = oldLines[i];
			const nl = newLines[i];
			if (ol === nl) {
				result.push({ type: 'same', text: ol ?? '' });
			} else {
				if (ol !== undefined) result.push({ type: 'removed', text: ol });
				if (nl !== undefined) result.push({ type: 'added', text: nl });
			}
		}
		return result;
	}

	$: hasChanges = lines.some((l) => l.type !== 'same');
</script>

{#if hasChanges}
	<div class="rounded-xl overflow-hidden border border-[var(--glass-border)] text-xs font-mono max-h-[400px] overflow-y-auto">
		{#each lines as line, i}
			<div class="px-3 py-0.5 flex gap-2 {line.type === 'added' ? 'bg-green-500/10 text-green-700 dark:text-green-400' : line.type === 'removed' ? 'bg-red-500/10 text-red-700 dark:text-red-400 line-through' : 'text-[var(--text-secondary)]'}">
				<span class="w-4 text-right text-[var(--text-tertiary)] select-none">{line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}</span>
				<pre class="whitespace-pre-wrap break-all">{line.text}</pre>
			</div>
		{/each}
	</div>
{:else}
	<p class="text-sm text-[var(--text-tertiary)]">No changes detected.</p>
{/if}
