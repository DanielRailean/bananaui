<script lang="ts">
	export let rows = 5;
	export let columns = 4;
</script>

<div class="w-full animate-pulse">
	<!-- Item count -->
	<div class="px-4 pt-3 pb-2">
		<div class="h-4 w-16 bg-black/[0.06] dark:bg-white/[0.06] rounded"></div>
	</div>
	<!-- Search field -->
	<div class="px-4 py-2">
		<div class="h-10 w-full rounded-xl bg-black/[0.04] dark:bg-white/[0.04]"></div>
	</div>
	<!-- Sort controls -->
	<div class="flex items-center gap-2 px-4 py-2">
		<div class="h-10 w-36 rounded-xl bg-black/[0.04] dark:bg-white/[0.04]"></div>
		<div class="h-10 w-24 rounded-xl bg-black/[0.03] dark:bg-white/[0.03]"></div>
		<div class="h-10 w-20 rounded-xl bg-black/[0.03] dark:bg-white/[0.03]"></div>
	</div>
	<!-- Table -->
	<div class="mx-4 rounded-xl border border-[var(--glass-border)] overflow-hidden">
		<div class="h-10 border-b border-[var(--glass-border)] bg-black/[0.02] dark:bg-white/[0.02] flex items-center gap-4 px-5">
			{#each Array(columns) as _, j}
				<div class="h-3 rounded bg-black/[0.06] dark:bg-white/[0.06]" style="width: {j === 0 ? '12%' : '18%'};"></div>
			{/each}
		</div>
		{#each Array(rows) as _, i}
			<div class="flex items-center gap-4 px-5 py-4 border-b border-[var(--glass-border)] last:border-0">
				{#each Array(columns) as _, j}
					<div
						class="h-4 rounded bg-black/[0.05] dark:bg-white/[0.05]"
						style="width: {j === 0 ? '28%' : j === columns - 1 ? '14%' : '20%'}; opacity: {1 - i * 0.08};"
					></div>
				{/each}
			</div>
		{/each}
	</div>
</div>
