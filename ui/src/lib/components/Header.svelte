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

		const searchParams = new URLSearchParams(window.location.search);
		const entityType = searchParams.get('type') ?? 'none';

		return entityType === item.name;
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
	class="flex flex-col shadow shadow-zinc-300 dark:shadow-zinc-800 p-4 pt-10 bg-stone-100 dark:bg-[#1E2021] rounded-r-xl font-light"
>
	<div class="flex flex-row items-center min-w-[200px]">
		<DarkToggle div_class="" />
		<h1 class="font-medium text-2xl">{staticConfig.name}</h1>
	</div>

	<nav class="text-2xl text-stone-400">
		<ul class="flex flex-col">
			{#each items as item}
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
						<a href="{base}{item.appPath}"
							>{capitalizeFirstLetter(item.name.replaceAll('_', ' '))}</a
						>
					</li>
				{/if}
			{/each}
		</ul>
	</nav>
</header>
