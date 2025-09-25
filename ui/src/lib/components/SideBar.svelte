<script lang="ts">
	import DarkToggle from './DarkToggle.svelte';
	import { page } from '$app/stores';

	type HeaderItem = {
		name: string;
		appPath: string;
		uiSpaceAfter?: boolean;
		uiSpaceBefore?: boolean;
		logo?: string;
	};
	let items: HeaderItem[] = [
		{
			name: 'info',
			appPath: '/'
		},
		{
			name: 'profile',
			appPath: '/profile'
		}
	];
	let itemsEnd: HeaderItem[] = [
		{
			name: 'settings',
			appPath: '/settings'
		},
		{
			name: 'preferences',
			appPath: '/preferences'
		}
	];
	import { onMount } from 'svelte';
	import { kongEntities } from '$lib/config';
	import { capitalizeFirstLetter } from '$lib/util';
	import { base } from '$app/paths';
	import { config, userToken } from '$lib/stores';
	import { get } from 'svelte/store';
	import { icons } from '$lib/icons';

	let mounted = false;

	$: $page, triggerLoad();

	function triggerLoad() {
		items = items;
	}
	function isCurrentPage(item: HeaderItem) {
		if (!mounted) return false;

		if (!window) return false;

		const searchParams = new URLSearchParams(window.location.search);
		const entityType = searchParams.get('type');

		if (entityType) {
			return entityType === item.name;
		}
		return window.location.pathname == item.appPath;
	}

	onMount(() => {
		mounted = true;
		const entities = kongEntities
			.filter((i) => {
				if (i.showInMenu === undefined) {
					return true;
				}
				return i.showInMenu;
			})
			.map((i) => {
				return { appPath: `/entities?type=${i.name.toLowerCase()}`, ...i };
			});
		items = [...items, ...entities, ...itemsEnd];
	});
</script>

<header
	class="flex flex-col shadow shadow-zinc-300 dark:shadow-zinc-800 p-4 pt-10 bg-stone-100 dark:bg-[#1E2021] font-light"
>
	<div class="flex flex-row items-center min-w-[230px]">
		<DarkToggle div_class="" />
	</div>

	<nav class="text-xl text-stone-400">
		<ul class="flex flex-col">
			{#each items as item}
				{#if item.uiSpaceBefore}
					<br />
				{/if}
				{#if item.name == 'profile'}
					{#if $userToken}
						<li
							class="mx-4 hover:dark:text-stone-200 hover:text-stone-600 mt-2 {isCurrentPage(item)
								? 'dark:text-stone-50 text-stone-700'
								: ''}"
						>
							<a href="{base}{item.appPath}"
								>{capitalizeFirstLetter(item.name.replaceAll('_', ' '))}</a
							>
						</li>
					{/if}
				{:else if item.name === 'settings'}
					{#if $config && get(config)?.source !== 'remote'}
						<li
							class="mx-4 hover:dark:text-stone-200 hover:text-stone-600 mt-2 {isCurrentPage(item)
								? 'dark:text-stone-50 text-stone-700'
								: ''}"
						>
							<a href="{base}{item.appPath}"
								>{capitalizeFirstLetter(item.name.replaceAll('_', ' '))}</a
							>
						</li>
					{/if}
				{:else}
					<li
						class="mx-4 hover:dark:text-stone-200 hover:text-stone-600 mt-2 {isCurrentPage(item)
							? 'dark:text-stone-50 text-stone-700'
							: ''}"
					>
						<div class="flex flex-row items-center">
							{#if item.logo}
								<div class="mr-1 h-6 w-6">
									{@html icons[item.logo]}
								</div>
							{/if}
							<a href="{base}{item.appPath}"
								>{capitalizeFirstLetter(item.name.replaceAll('_', ' '))}</a
							>
						</div>
					</li>
				{/if}
				{#if item.uiSpaceAfter}
					<br />
				{/if}
			{/each}
		</ul>
	</nav>
</header>
