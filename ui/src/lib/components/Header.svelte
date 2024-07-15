<script lang="ts">
	import DarkToggle from './DarkToggle.svelte';
	import { page } from '$app/stores';

	type HeaderItem = {
		name: string;
		appPath: string;
	};
	let items: HeaderItem[] = [
		{
			name: 'profile',
			appPath: '/profile'
		},
		{
			name: 'overview',
			appPath: '/'
		}
	];
	let itemsEnd: HeaderItem[] = [
		{
			name: 'settings',
			appPath: '/settings'
		}
	];
	import { onMount } from 'svelte';
	import { kongEntities } from '$lib/config';
	import { staticConfig } from '$lib/config';
	import { capitalizeFirstLetter } from '$lib/util';
	import { base } from '$app/paths';
	import { config, userToken } from '$lib/stores';
	import { get } from 'svelte/store';

	let mounted = false;

	$: $page, triggerLoad();

	function triggerLoad() {
		items = items;
	}
	function isCurrentPage(item: HeaderItem) {
		if (!mounted) return false;

		if (!window) return false;
		return (
			window.location.pathname == item.appPath || window.location.search.includes(`=${item.name}`)
		);
	}

	onMount(() => {
		mounted = true;
		const entities = kongEntities.map((i) => {
			return { name: i.name, appPath: `/entities?type=${i.name.toLowerCase()}` };
		});
		items = [...items, ...entities, ...itemsEnd];
	});
</script>

<header
	class="flex flex-col border-r-[1px] dark:border-slate-800 p-4 pt-10 bg-slate-100 dark:bg-gray-900 rounded-r-xl"
>
	<div class="flex flex-row items-center min-w-[200px]">
		<DarkToggle div_class="" />
		<h1 class="font-medium text-2xl">{staticConfig.name}</h1>
	</div>

	<nav class="text-2xl text-slate-400">
		<ul class="flex flex-col">
			{#each items as item}
				{#if item.name == 'profile'}
					{#if $userToken}
						<li
							class="mx-4 hover:dark:text-slate-200 hover:text-slate-600 mt-2 {isCurrentPage(item)
								? 'dark:text-slate-50 text-slate-700'
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
							class="mx-4 hover:dark:text-slate-200 hover:text-slate-600 mt-2 {isCurrentPage(item)
								? 'dark:text-slate-50 text-slate-700'
								: ''}"
						>
							<a href="{base}{item.appPath}"
								>{capitalizeFirstLetter(item.name.replaceAll('_', ' '))}</a
							>
						</li>
					{/if}
				{:else}
					<li
						class="mx-4 hover:dark:text-slate-200 hover:text-slate-600 mt-2 {isCurrentPage(item)
							? 'dark:text-slate-50 text-slate-700'
							: ''}"
					>
						<a href="{base}{item.appPath}"
							>{capitalizeFirstLetter(item.name.replaceAll('_', ' '))}</a
						>
					</li>
				{/if}
			{/each}
		</ul>
	</nav>
</header>
