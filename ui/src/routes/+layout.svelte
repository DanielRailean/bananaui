<script>
	import { staticConfig } from '$lib/config';
	import { page } from '$app/stores';
	import { onNavigate } from '$app/navigation';
	import ConfigLoader from '$lib/components/ConfigLoader.svelte';
	import Sidebar from '$lib/components/SideBar.svelte';
	import './styles.css';
	import Toasts from '$lib/components/Toasts.svelte';
	import Preferences from '$lib/components/Preferences.svelte';
	import LoginRedirect from '$lib/components/LoginRedirect.svelte';
	import ConfirmDialog from '$lib/components/ConfirmDialog.svelte';
	import CommandPalette from '$lib/components/CommandPalette.svelte';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import NotificationBell from '$lib/components/NotificationBell.svelte';
	import FaviconBadge from '$lib/components/FaviconBadge.svelte';
	import { base } from '$app/paths';

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;
		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<svelte:head>
	<title>{staticConfig.name}</title>
	<script src={`${base}/prism.js`}></script>
</svelte:head>

<ConfigLoader />
<Preferences />
<LoginRedirect />
<Toasts />
<ConfirmDialog />
<CommandPalette />
<FaviconBadge />
<div class="flex flex-row min-h-screen max-h-screen">
	{#if !$page.url.pathname.includes('/login')}
		<Sidebar />
	{/if}

	<main class="flex-1 min-w-0 overflow-y-auto {$page.url.pathname.includes('/login') ? 'flex items-center justify-center' : ''}">
		{#if !$page.url.pathname.includes('/login')}
			<!-- Top bar -->
			<div class="sticky top-0 z-[100] flex items-center justify-end px-8 py-3 bg-[#f8fafc]/80 dark:bg-[#111213]/80 backdrop-blur-md border-b border-[var(--glass-border)]">
				<div class="flex items-center gap-2">
					<button
						class="text-xs text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] px-2 py-1 rounded-lg border border-[var(--glass-border)] font-mono transition-colors"
						on:click={() => { window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true })); }}
					>⌘K</button>
					<NotificationBell />
				</div>
			</div>
		{/if}
		<div class="w-full px-8 py-6 dark:text-stone-50">
			{#if !$page.url.pathname.includes('/login')}
				<Breadcrumb />
			{/if}
			<slot />
		</div>
	</main>
</div>

<style>
</style>
