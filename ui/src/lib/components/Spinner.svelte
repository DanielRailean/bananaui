<script lang="ts">
	export let height = 40;
	export let text = '';
	export let uppercased = true;
</script>

<div class="flex items-center gap-3">
	<svg
		class="animate-spin"
		width={height > 60 ? 40 : height}
		height={height > 60 ? 40 : height}
		viewBox="0 0 24 24"
		fill="none"
	>
		<circle class="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" />
		<path
			class="opacity-80"
			d="M4 12a8 8 0 018-8"
			stroke="var(--accent)"
			stroke-width="3"
			stroke-linecap="round"
		/>
	</svg>
	{#if text}
		<span class="text-sm text-[var(--text-secondary)] font-medium">
			{uppercased ? text.toUpperCase() : text}
		</span>
	{/if}
</div>
