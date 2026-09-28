<script lang="ts">
	import { page } from '$app/stores';
	import { base } from '$app/paths';
	import { capitalizeFirstLetter } from '$lib/util';
	import { preferences } from '$lib/stores';
	import { get } from 'svelte/store';
	import { icons } from '$lib/icons';

	interface Crumb {
		label: string;
		href?: string;
		icon?: string;
	}

	$: crumbs = buildCrumbs($page.url);

	function getEntityIcon(type: string): string | undefined {
		const entity = get(preferences.kongEntities).find((e) => e.name === type);
		return entity?.logo;
	}

	function buildCrumbs(url: URL): Crumb[] {
		const path = url.pathname.replace(base, '');
		const params = url.searchParams;
		const result: Crumb[] = [];

		if (path === '/' || path === '') return [];

		const segments = path.split('/').filter(Boolean);

		if (segments[0] === 'entities') {
			const type = params.get('type');
			if (type) {
				result.push({ label: capitalizeFirstLetter(type), href: `${base}/entities?type=${type}`, icon: getEntityIcon(type) });
			}
		} else if (segments[0] === 'entity') {
			const type = params.get('type');
			const id = params.get('id');
			if (type) {
				result.push({ label: capitalizeFirstLetter(type), href: `${base}/entities?type=${type}`, icon: getEntityIcon(type) });
			}
			if (id) {
				result.push({ label: id });
			}
		} else if (segments[0] === 'add') {
			const type = params.get('type');
			if (type) {
				result.push({ label: capitalizeFirstLetter(type), href: `${base}/entities?type=${type}`, icon: getEntityIcon(type) });
			}
			result.push({ label: 'Add new' });
		} else {
			result.push({ label: capitalizeFirstLetter(segments[0]) });
		}

		return result;
	}
</script>

{#if crumbs.length > 0}
	<nav class="flex items-center gap-1.5 mb-5 text-sm" aria-label="Breadcrumb">
		<a href="{base}/" class="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors">Home</a>
		{#each crumbs as crumb, i}
			<span class="text-[var(--text-tertiary)]">/</span>
			{#if crumb.href && i < crumbs.length - 1}
				<a href={crumb.href} class="flex items-center gap-1.5 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors">
					{#if crumb.icon}
						<span class="h-3.5 w-3.5 opacity-60">{@html icons[crumb.icon]}</span>
					{/if}
					{crumb.label}
				</a>
			{:else}
				<span class="flex items-center gap-1.5 text-[var(--text-secondary)] font-medium">
					{#if crumb.icon}
						<span class="h-3.5 w-3.5 opacity-60">{@html icons[crumb.icon]}</span>
					{/if}
					{crumb.label}
				</span>
			{/if}
		{/each}
	</nav>
{/if}
