<script lang="ts">
	import { toastList } from '$lib/toastStore';
	import { fly } from 'svelte/transition';
	import { base } from '$app/paths';

	let open = false;

	$: errorCount = toastList.filter((t) => t.type === 'error').length;
	$: recentItems = toastList.slice(-20).reverse();

	function toggle() {
		open = !open;
	}

	const iconColor: Record<string, string> = {
		error: 'bg-[var(--danger)]',
		info: 'bg-[var(--accent)]',
		success: 'bg-[var(--success)]',
	};
</script>

<div class="relative">
	<button
		class="btn-icon h-9 w-9 relative"
		title="Notifications"
		on:click={toggle}
	>
		<svg class="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
			<path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
		</svg>
		{#if errorCount > 0}
			<span class="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[var(--danger)] text-white text-[10px] flex items-center justify-center font-bold">
				{errorCount}
			</span>
		{/if}
	</button>

	{#if open}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div class="fixed inset-0 z-[60]" on:click={() => open = false} role="presentation"></div>
		<div
			class="absolute right-0 top-full mt-2 w-[360px] max-h-[480px] overflow-y-auto rounded-xl border border-[var(--glass-border)] bg-white dark:bg-[#1c1e20] shadow-2xl z-[61]"
			transition:fly={{ y: -8, duration: 150 }}
		>
			<div class="px-4 py-3 border-b border-[var(--glass-border)] flex items-center justify-between">
				<p class="text-sm font-semibold">Notifications</p>
				<a href="{base}/notifications" class="text-xs text-[var(--accent)] hover:underline" on:click={() => open = false}>View all</a>
			</div>
			{#if recentItems.length === 0}
				<p class="px-4 py-6 text-sm text-[var(--text-tertiary)] text-center">No notifications</p>
			{:else}
				{#each recentItems as item}
					<div class="flex items-start gap-2.5 px-4 py-2.5 border-b border-[var(--glass-border)] last:border-0">
						<div class="mt-1.5 h-2 w-2 rounded-full flex-shrink-0 {iconColor[item.type] ?? iconColor.info}"></div>
						<div class="flex-1 min-w-0">
							<p class="text-[13px] text-[var(--text-primary)] break-words leading-snug">{item.message}</p>
							{#if item.timestamp}
								<p class="text-[11px] text-[var(--text-tertiary)] mt-0.5">{new Date(item.timestamp).toLocaleTimeString()}</p>
							{/if}
						</div>
					</div>
				{/each}
			{/if}
		</div>
	{/if}
</div>
