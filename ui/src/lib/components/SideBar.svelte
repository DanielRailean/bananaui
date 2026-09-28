<script lang="ts">
	import DarkToggle from './DarkToggle.svelte';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { capitalizeFirstLetter } from '$lib/util';
	import { base } from '$app/paths';
	import { config, preferences, sidebarCollapsed, userToken } from '$lib/stores';
	import { get } from 'svelte/store';
	import { icons } from '$lib/icons';

	type NavItem = {
		name: string;
		appPath: string;
		uiSpaceAfter?: boolean;
		uiSpaceBefore?: boolean;
		logo?: string;
	};

	const navIcons: Record<string, string> = {
		home: '<svg class="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"/></svg>',
		reference: '<svg class="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/></svg>',
		profile: '<svg class="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/></svg>',
		notifications: '<svg class="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"/></svg>',
		settings: '<svg class="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>',
		preferences: '<svg class="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"/></svg>',
	};

	const entityFallbackIcons: Record<string, string> = {
		services: '<svg class="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z"/></svg>',
		routes: '<svg class="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"/></svg>',
		plugins: '<svg class="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.39 48.39 0 01-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 01-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 00-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 01-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 00.657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 005.427-.63 48.05 48.05 0 00.582-4.717.532.532 0 00-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.96.401v0a.656.656 0 00.658-.663 48.422 48.422 0 00-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 01-.61-.58v0z"/></svg>',
		consumers: '<svg class="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"/></svg>',
		upstreams: '<svg class="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"/></svg>',
		certificates: '<svg class="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/></svg>',
		targets: '<svg class="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0120.25 6v1.5m0 9V18A2.25 2.25 0 0118 20.25h-1.5m-9 0H6A2.25 2.25 0 013.75 18v-1.5M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>',
		snis: '<svg class="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.9-1.414l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"/></svg>',
		ca_certificates: '<svg class="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/></svg>',
		consumer_groups: '<svg class="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"/></svg>',
		vaults: '<svg class="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V19.5m0 2.25l-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25"/></svg>',
		keys: '<svg class="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"/></svg>',
		key_sets: '<svg class="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"/></svg>',
		clustering: '<svg class="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"/></svg>',
		dataplanes: '<svg class="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"/></svg>',
	};

	function getEntityIcon(name: string, logo?: string): string {
		if (logo && icons[logo]) return icons[logo];
		if (entityFallbackIcons[name]) return entityFallbackIcons[name];
		// Generic cube icon for anything else
		return '<svg class="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"/></svg>';
	}

	let navItems: NavItem[] = [
		{ name: 'home', appPath: '/' },
		{ name: 'reference', appPath: '/reference' },
	];

	let entityItems: NavItem[] = [];
	let accountItems: NavItem[] = [];
	let mounted = false;

	$: $page, triggerLoad();
	$: collapsed = $sidebarCollapsed;

	function triggerLoad() {
		navItems = navItems;
		entityItems = entityItems;
	}

	function isCurrentPage(item: NavItem) {
		if (!mounted) return false;
		if (!window) return false;
		const searchParams = new URLSearchParams(window.location.search);
		const entityType = searchParams.get('type');
		if (entityType) return entityType === item.name;
		return window.location.pathname.endsWith(item.appPath);
	}

	function toggleCollapse() {
		sidebarCollapsed.set(!$sidebarCollapsed);
	}

	onMount(() => {
		mounted = true;
		const entities = get(preferences.kongEntities)
			.filter((i) => i.showInMenu === undefined || i.showInMenu)
			.map((i) => ({ appPath: `/entities?type=${i.name.toLowerCase()}`, ...i }));
		entityItems = entities;
	});

	$: {
		const items: NavItem[] = [];
		if ($userToken) items.push({ name: 'profile', appPath: '/profile' });
		items.push({ name: 'notifications', appPath: '/notifications' });
		if ($config?.source === 'local') items.push({ name: 'settings', appPath: '/settings' });
		items.push({ name: 'preferences', appPath: '/preferences' });
		accountItems = items;
	}

	const linkClass = (active: boolean) =>
		`flex items-center gap-3 rounded-xl text-[14px] font-medium transition-all duration-100
		${collapsed ? 'px-2.5 py-2.5 justify-center' : 'px-3 py-2.5'}
		${active
			? 'text-[var(--text-primary)] bg-[var(--accent)]/10 border-l-[3px] border-[var(--accent)]' + (collapsed ? ' pl-[7px]' : ' pl-[9px]')
			: 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] border-l-[3px] border-transparent' + (collapsed ? ' pl-[7px]' : ' pl-[9px]')
		}`;
</script>

<aside class="sticky top-0 h-screen flex flex-col {collapsed ? 'w-[68px] min-w-[68px]' : 'w-[260px] min-w-[260px]'} border-r border-[var(--glass-border)] bg-[var(--surface)] overflow-hidden transition-[width,min-width] duration-200">
	<!-- Brand + collapse toggle -->
	<div class="flex items-center {collapsed ? 'justify-center px-2' : 'justify-between px-4'} pt-5 pb-10">
		{#if !collapsed}
			<DarkToggle div_class="" />
		{/if}
		<button
			class="btn-icon h-8 w-8 flex-shrink-0"
			title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
			on:click={toggleCollapse}
		>
			<svg class="w-4 h-4 transition-transform {collapsed ? 'rotate-180' : ''}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
			</svg>
		</button>
	</div>

	<nav class="flex-1 overflow-y-auto {collapsed ? 'px-2' : 'px-3'} pb-4 fancy-scroll">
		<!-- Navigation -->
		<div class="mb-4">
			{#if !collapsed}
				<p class="px-3 mb-2 text-[11px] font-semibold uppercase tracking-widest text-[var(--text-tertiary)]">Navigation</p>
			{/if}
			<ul class="flex flex-col gap-0.5">
				{#each navItems as item}
					<li>
						<a href="{base}{item.appPath}" class={linkClass(isCurrentPage(item))} title={collapsed ? capitalizeFirstLetter(item.name) : undefined}>
							<span class="h-[18px] w-[18px] flex-shrink-0 opacity-60">{@html navIcons[item.name] ?? ''}</span>
							{#if !collapsed}
								{capitalizeFirstLetter(item.name.replaceAll('_', ' '))}
							{/if}
						</a>
					</li>
				{/each}
			</ul>
		</div>

		<!-- Entities -->
		{#if entityItems.length > 0}
			<div class="mb-4">
				{#if !collapsed}
					<p class="px-3 mb-2 text-[11px] font-semibold uppercase tracking-widest text-[var(--text-tertiary)]">Entities</p>
				{:else}
					<div class="h-px bg-[var(--glass-border)] mx-2 my-2"></div>
				{/if}
				<ul class="flex flex-col gap-0.5">
					{#each entityItems as item}
						{#if item.uiSpaceBefore}
							<div class="h-1.5"></div>
						{/if}
						<li>
							<a href="{base}{item.appPath}" class={linkClass(isCurrentPage(item))} title={collapsed ? capitalizeFirstLetter(item.name) : undefined}>
								<div class="h-[18px] w-[18px] flex-shrink-0 opacity-60">
									{@html getEntityIcon(item.name, item.logo)}
								</div>
								{#if !collapsed}
									{capitalizeFirstLetter(item.name.replaceAll('_', ' '))}
								{/if}
							</a>
						</li>
						{#if item.uiSpaceAfter}
							<div class="h-1.5"></div>
						{/if}
					{/each}
				</ul>
			</div>
		{/if}

		<!-- Account -->
		{#if accountItems.length > 0}
			<div class="mb-2">
				{#if !collapsed}
					<p class="px-3 mb-2 text-[11px] font-semibold uppercase tracking-widest text-[var(--text-tertiary)]">Account</p>
				{:else}
					<div class="h-px bg-[var(--glass-border)] mx-2 my-2"></div>
				{/if}
				<ul class="flex flex-col gap-0.5">
					{#each accountItems as item}
						<li>
							<a href="{base}{item.appPath}" class={linkClass(isCurrentPage(item))} title={collapsed ? capitalizeFirstLetter(item.name) : undefined}>
								<span class="h-[18px] w-[18px] flex-shrink-0 opacity-60">{@html navIcons[item.name] ?? ''}</span>
								{#if !collapsed}
									{capitalizeFirstLetter(item.name.replaceAll('_', ' '))}
								{/if}
							</a>
						</li>
					{/each}
				</ul>
			</div>
		{/if}
	</nav>

	<!-- Cmd+K hint -->
	{#if !collapsed}
		<div class="px-5 py-3 border-t border-[var(--glass-border)]">
			<p class="text-[11px] text-[var(--text-tertiary)]">
				<kbd class="font-mono px-1 py-0.5 rounded bg-black/[0.05] dark:bg-white/[0.07]">⌘K</kbd> Quick search
			</p>
		</div>
	{/if}
</aside>
