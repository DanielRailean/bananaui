<script lang="ts">
	import { addToast } from '$lib/toastStore';
	import TreeWrapper from '$lib/components/treeWrapper.svelte';
	import { apiService, clearCache } from '$lib/requests';
	import { onMount, onDestroy } from 'svelte';
	import { config, preferences } from '$lib/stores';

	import { get } from 'svelte/store';
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';

	import { DateTime } from 'luxon';

	let info: any | undefined;
	let entityCounts: { name: string; count: number; loading: boolean }[] = [];
	let dataplanes: any[] = [];
	let expandedDp: string | null = null;
	let dpInterval: ReturnType<typeof setInterval> | undefined;
	let dpLastRefresh: DateTime | undefined;
	let tick = 0;
	let tickInterval: ReturnType<typeof setInterval> | undefined;

	const shortcuts = [
		['Quick search', '⌘K / Ctrl+K'],
		['Focus search', '/'],
		['Navigate list', 'j / k'],
		['Open entity', 'Enter'],
		['Edit entity', 'e'],
		['Delete entity', 'd'],
		['Go to page', 'g + key'],
		['Unfocus / cancel', 'Esc'],
	];

	const dpFetchIntervalSeconds = 10

	async function fetchDataplanes() {
		try {
			clearCache('clustering/data-planes');
			const api = await apiService();
			const dpRes = await api.findAll('clustering/data-planes', {}, '', true);
			if (dpRes.ok && dpRes.data?.data) {
				dataplanes = dpRes.data.data.sort((a: any, b: any) => b.last_seen - a.last_seen);
				dpLastRefresh = DateTime.now();
				const now = Date.now() / 1000;
				const unhealthy = dataplanes.filter(dp => (now - dp.last_seen) < 1800 && dp.sync_status !== 'normal');
				if (unhealthy.length > 0) {
					addToast({ message: `${unhealthy.length} data plane(s) with sync issues: ${unhealthy.map(dp => dp.hostname).join(', ')}`, type: 'error' });
				}
			}
		} catch {}
	}

	onMount(async () => {
		try {
			const entities = get(preferences.kongEntities);
			const showEntities = entities.slice(0, 4).map(e => e.name);
			entityCounts = showEntities.map(name => ({ name, count: 0, loading: true }));
			const api = await apiService();

			let res = await api.getInfo();
			if (!res.ok && !res.data) {
				await new Promise(r => setTimeout(r, 1000));
				res = await api.getInfo();
			}
			let infoRaw = res.data;
			if (!infoRaw) return;
			const sortedPlugins = Object.entries(infoRaw?.plugins.available_on_server ?? {}).sort(
				(a, b) => b[1].priority - a[1].priority
			);
			const plugins = Object.fromEntries(sortedPlugins);
			infoRaw!.plugins.available_on_server = plugins;
			info = {};
			info.api_url = $config?.config.kongApi.endpoint;
			info = { ...info, ...infoRaw };

			// Fetch all entity counts in parallel
			const countPromises = entityCounts.map(async (ent, i) => {
				try {
					let total = 0;
					let r = await api.findAll(ent.name, {});
					if (r.ok) {
						total += r.data?.data?.length ?? 0;
						while (r.data?.next) {
							r = await api.request(r.data.next);
							if (r.ok) total += r.data?.data?.length ?? 0;
							else break;
						}
						entityCounts[i] = { ...entityCounts[i], count: total, loading: false };
					} else {
						entityCounts[i] = { ...entityCounts[i], loading: false };
					}
				} catch {
					entityCounts[i] = { ...entityCounts[i], loading: false };
				}
				entityCounts = entityCounts;
			});
			tickInterval = setInterval(() => { tick++; }, 1000);
			await Promise.all([...countPromises, fetchDataplanes()]);
			dpInterval = setInterval(fetchDataplanes, dpFetchIntervalSeconds * 1000);
		} catch (error: any) {
			if (error.message !== 'Failed to fetch' && error.message !== 'Config not available') {
				addToast({ message: `Failed fetching the info. ${error.message ? error.message : ''}` });
			}
		}
	});

	onDestroy(() => {
		if (dpInterval) clearInterval(dpInterval);
		if (tickInterval) clearInterval(tickInterval);
	});
</script>

<div class="font-sans">
	{#if !info}
		<!-- Loading state — cinematic -->
		<div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--accent)]/5 via-transparent to-purple-500/5 p-8 mb-8">
			<div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--accent)_0%,_transparent_60%)] opacity-[0.04]"></div>
			<div class="animate-pulse space-y-6">
				<div class="h-8 w-48 rounded-lg bg-black/[0.06] dark:bg-white/[0.06]"></div>
				<div class="h-4 w-72 rounded bg-black/[0.04] dark:bg-white/[0.04]"></div>
				<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
					{#each Array(4) as _}
						<div class="rounded-2xl bg-black/[0.03] dark:bg-white/[0.03] p-5 h-24"></div>
					{/each}
				</div>
			</div>
		</div>
	{:else}
		<!-- Hero banner -->
		<div class="relative overflow-hidden rounded-2xl mb-8 p-8 bg-gradient-to-br from-[var(--accent)]/[0.08] via-purple-500/[0.04] to-indigo-600/[0.06] border border-[var(--glass-border)]">
			<div class="absolute top-0 right-0 w-[400px] h-[400px] bg-[radial-gradient(circle,_var(--accent)_0%,_transparent_70%)] opacity-[0.06] -translate-y-1/2 translate-x-1/4"></div>
			<div class="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[radial-gradient(circle,_#a855f7_0%,_transparent_70%)] opacity-[0.05] translate-y-1/2 -translate-x-1/4"></div>
			<div class="relative">
				<p class="text-[11px] uppercase tracking-[0.2em] text-[var(--accent)] font-bold mb-2">Gateway Dashboard</p>
				<h1 class="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-2 tracking-tight">
					{info.tagline ? info.tagline.replace(/\.$/, '') : 'Kong Gateway'}
				</h1>
				<p class="text-[var(--text-secondary)] text-base">
					<span class="font-mono text-[var(--accent)]">v{info.version ?? '?'}</span>
					<span class="mx-2 text-[var(--text-tertiary)]">·</span>
					<span>{Object.keys(info.plugins?.available_on_server ?? {}).length} plugins</span>
					<span class="mx-2 text-[var(--text-tertiary)]">·</span>
					<span>{info.configuration?.database ?? 'unknown'} backend</span>
				</p>
			</div>
		</div>

		<!-- Entity cards — big, bold counters -->
		{#if entityCounts.length > 0}
			<div class="mb-8">
				<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
					{#each entityCounts as ent}
						<button
							class="group relative overflow-hidden rounded-2xl p-5 text-left transition-all duration-200 cursor-pointer
								border border-[var(--glass-border)] hover:border-[var(--accent)]/30
								bg-[var(--glass-bg)] backdrop-blur-md hover:shadow-lg hover:shadow-[var(--accent)]/[0.06] hover:-translate-y-0.5"
							on:click={() => goto(`${base}/entities?type=${ent.name}`)}
						>
							<div class="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/[0.00] to-[var(--accent)]/[0.00] group-hover:from-[var(--accent)]/[0.03] group-hover:to-purple-500/[0.02] transition-all duration-200"></div>
							<div class="relative">
								<p class="text-[11px] text-[var(--text-tertiary)] group-hover:text-[var(--accent)] transition-colors font-bold uppercase tracking-[0.15em] mb-2">{ent.name}</p>
								{#if ent.loading}
									<div class="h-8 w-12 rounded-lg bg-black/[0.05] dark:bg-white/[0.05] animate-pulse"></div>
								{:else}
									<p class="text-3xl font-black text-[var(--text-primary)] tabular-nums">{ent.count}</p>
								{/if}
							</div>
							<svg class="absolute bottom-3 right-3 w-4 h-4 text-[var(--text-tertiary)] opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>
						</button>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Dataplanes -->
		{#if dataplanes.filter(dp => (Date.now() / 1000 - dp.last_seen) < 1800).length > 0}
			{@const activeDps = dataplanes.filter(dp => (Date.now() / 1000 - dp.last_seen) < 1800)}
			<div class="mb-8">
				<div class="flex items-baseline gap-3 mb-4">
					<h2 class="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider">Data Planes</h2>
					<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-[var(--accent)]/10 text-[var(--accent)]">
						{activeDps.length} active
					</span>
					{#if dpLastRefresh}
				{@const elapsed = Math.round((Date.now() - dpLastRefresh.toMillis()) / 1000) + tick * 0}
						{@const remaining = Math.max(0, dpFetchIntervalSeconds - elapsed)}
						<span class="ml-auto inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--accent)] pr-1">
							<span class="relative flex h-2 w-2">
								<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-50"></span>
								<span class="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent)]"></span>
							</span>
							<span class="tabular-nums inline-block w-[26px] text-right">{remaining} s</span>
						</span>
					{/if}
				</div>
				<div class="rounded-2xl overflow-hidden border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-md divide-y divide-[var(--glass-border)]">
					{#each activeDps as dp}
						{@const expanded = expandedDp === dp.id}
						<div>
							<button
								class="w-full flex items-center gap-3 px-5 py-3.5 text-left hover:bg-[var(--accent)]/[0.02] transition-colors"
								on:click={() => { expandedDp = expanded ? null : dp.id; }}
							>
								<div class="relative h-2.5 w-2.5 flex-shrink-0">
									{#if dp.sync_status === 'normal'}
										<span class="absolute inset-0 rounded-full bg-[var(--success)] animate-[pulse_3s_ease-in-out_infinite] opacity-40"></span>
									{/if}
									<span class="relative block h-2.5 w-2.5 rounded-full {dp.sync_status === 'normal' ? 'bg-[var(--success)]' : 'bg-[var(--danger)]'}"></span>
								</div>
								<span class="text-[13px] font-mono font-medium text-[var(--text-primary)] truncate flex-1">{dp.hostname}</span>
								<span class="text-[11px] text-[var(--text-tertiary)] font-mono flex-shrink-0 w-[4.5rem] text-right">{dp.config_hash?.substring(dp.config_hash.indexOf('-') + 1, dp.config_hash.indexOf('-') + 9) ?? '-'}</span>
								<span class="text-[11px] text-[var(--text-tertiary)] flex-shrink-0 w-[6rem] text-right">{DateTime.fromSeconds(dp.last_seen).toRelative()}</span>
								<svg class="w-3.5 h-3.5 text-[var(--text-tertiary)] flex-shrink-0 transition-transform duration-200 {expanded ? 'rotate-180' : ''}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/></svg>
							</button>
							{#if expanded}
								<div class="px-5 pb-4 border-t border-[var(--glass-border)] pt-3 bg-black/[0.01] dark:bg-white/[0.01]">
									<dl class="grid grid-cols-[auto_1fr] gap-x-5 gap-y-2 text-[12px] ml-5">
										<dt class="text-[var(--text-tertiary)] font-medium">version</dt>
										<dd class="font-mono text-[var(--text-primary)]">{dp.version}</dd>
										<dt class="text-[var(--text-tertiary)] font-medium">ip</dt>
										<dd class="font-mono text-[var(--text-primary)]">{dp.ip}</dd>
										<dt class="text-[var(--text-tertiary)] font-medium">status</dt>
										<dd class="font-mono font-semibold {dp.sync_status === 'normal' ? 'text-[var(--success)]' : 'text-[var(--danger)]'}">{dp.sync_status}</dd>
										<dt class="text-[var(--text-tertiary)] font-medium">hash</dt>
										<dd class="font-mono text-[var(--text-primary)]">{dp.config_hash ?? '-'}</dd>
										<dt class="text-[var(--text-tertiary)] font-medium">id</dt>
										<dd class="font-mono text-[var(--text-primary)]">{dp.id}</dd>
										<dt class="text-[var(--text-tertiary)] font-medium">ttl</dt>
										<dd class="font-mono text-[var(--text-primary)]">{dp.ttl}s</dd>
										{#if dp.cert_details?.expiry_timestamp}
											<dt class="text-[var(--text-tertiary)] font-medium">cert expires</dt>
											<dd class="font-mono text-[var(--text-primary)]">{DateTime.fromSeconds(dp.cert_details.expiry_timestamp).toRelative()}</dd>
										{/if}
									</dl>
								</div>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Full info tree -->
		<div class="rounded-2xl overflow-hidden border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-md">
			<div class="px-5 py-3 border-b border-[var(--glass-border)]">
				<h2 class="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider">Raw Info</h2>
			</div>
			<TreeWrapper data={info} expandFields={[]} rounded={false} />
		</div>

		<!-- Keyboard shortcuts -->
		<div class="mt-8 relative overflow-hidden rounded-2xl p-6 border border-[var(--glass-border)] bg-gradient-to-br from-[var(--accent)]/[0.03] via-transparent to-purple-500/[0.02]">
			<div class="absolute top-0 right-0 w-[200px] h-[200px] bg-[radial-gradient(circle,_var(--accent)_0%,_transparent_70%)] opacity-[0.04]"></div>
			<h2 class="text-sm font-bold text-[var(--accent)] uppercase tracking-[0.15em] mb-5">Keyboard Shortcuts</h2>
			<div class="relative grid grid-cols-2 md:grid-cols-4 gap-3">
				{#each shortcuts as [label, key]}
					<div class="flex flex-col items-center gap-2 p-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-transparent hover:border-[var(--accent)]/20 transition-colors">
						<kbd class="font-mono text-sm px-3 py-1.5 rounded-lg bg-black/[0.05] dark:bg-white/[0.08] text-[var(--accent)] font-bold shadow-sm border border-black/[0.08] dark:border-white/[0.1]">{key}</kbd>
						<span class="text-[11px] text-[var(--text-tertiary)] font-medium">{label}</span>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>
