<script lang="ts">
	import { toastList, clearToasts } from '$lib/toastStore';
	import { confirm } from '$lib/confirmStore';
	import { onMount } from 'svelte';
	import { TrashBinOutline } from 'flowbite-svelte-icons';

	let localToasts: any[] = [];
	function loadToasts() {
		localToasts = toastList.reverse().map((item) => {
			return { message: item.message, type: item.type, timestamp: item.timestamp };
		});
	}
	onMount(() => {
		loadToasts();
	});

	function groupByDate(items: any[]) {
		const groups: { label: string; items: any[] }[] = [];
		const today = new Date().toDateString();
		const yesterday = new Date(Date.now() - 86400000).toDateString();
		const buckets: Record<string, any[]> = {};

		for (const item of items) {
			const d = new Date(item.timestamp).toDateString();
			const label = d === today ? 'Today' : d === yesterday ? 'Yesterday' : d;
			if (!buckets[label]) buckets[label] = [];
			buckets[label].push(item);
		}
		for (const [label, items] of Object.entries(buckets)) {
			groups.push({ label, items });
		}
		return groups;
	}

	$: grouped = groupByDate(localToasts);

	const iconColor: Record<string, string> = {
		error: 'bg-[var(--danger)]',
		info: 'bg-[var(--accent)]',
		success: 'bg-[var(--success)]',
	};
</script>

<div>
	<div class="flex items-center justify-between mb-6">
		<div>
			<h1 class="text-2xl font-semibold">Notifications</h1>
			<p class="text-sm text-[var(--text-secondary)]">{localToasts.length} total</p>
		</div>
		{#if localToasts.length > 0}
			<button
				on:click={async () => {
					const ok = await confirm({
						title: 'Clear notifications',
						message: `Delete all ${localToasts.length} notifications?`,
						variant: 'danger',
						confirmText: 'Delete all'
					});
					if (!ok) return;
					clearToasts();
					loadToasts();
				}}
				class="btn-ghost text-[var(--danger)]"
			>
				<TrashBinOutline size="sm" />
				Clear all
			</button>
		{/if}
	</div>

	{#if localToasts.length === 0}
		<p class="text-[var(--text-tertiary)] text-sm">No notifications yet.</p>
	{:else}
		{#each grouped as group}
			<div class="mb-6">
				<p class="text-[11px] uppercase tracking-widest font-semibold text-[var(--text-tertiary)] mb-3">{group.label}</p>
				<div class="flex flex-col gap-2">
					{#each group.items as item}
						<div class="flex items-start gap-3 px-4 py-3 rounded-xl glass">
							<div class="mt-1 h-2.5 w-2.5 rounded-full flex-shrink-0 {iconColor[item.type] ?? iconColor.info}"></div>
							<div class="flex-1 min-w-0">
								<p class="text-sm text-[var(--text-primary)] break-words">{item.message}</p>
								<p class="text-xs text-[var(--text-tertiary)] mt-1">{new Date(item.timestamp).toLocaleTimeString()}</p>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/each}
	{/if}
</div>
