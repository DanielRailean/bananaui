<script>
	import DarkToggle from './DarkToggle.svelte';
	import { page } from '$app/stores';

	let items = [
		{
			name: 'profile',
			path: '/profile'
		},
		{
			name: 'overview',
			path: '/'
		}
	];
	import { onMount } from 'svelte';
	import { kongEntities } from '$lib/config';
	import { staticConfig } from '$lib/config';
	import { capitalizeFirstLetter } from '$lib/util';

	onMount(() => {
		const entities = kongEntities.map((i) => {
			return { name: i.name, path: `/${i.name.toLowerCase()}` };
		});
		items = [...items, ...entities];
	});
</script>

<header
	class="flex flex-col border-r-[1px] dark:border-slate-800 p-4 pt-10 bg-slate-100 dark:bg-gray-900 rounded-r-xl"
>
	<div class="flex flex-row items-center min-w-[200px]">
		<DarkToggle div_class="" />
		<h1 class="font-medium text-2xl">{staticConfig.name}</h1>
		<!-- <DarkMode /> -->
	</div>

	<nav class="text-2xl text-slate-400">
		<ul class="flex flex-col">
			{#each items as item}
				<li
					class="mx-4 hover:dark:text-slate-200 hover:text-slate-600 mt-2 {$page.url.pathname ===
					item.path
						? 'dark:text-slate-50 text-slate-700'
						: ''}"
				>
					<a href={item.path}>{capitalizeFirstLetter(item.name.replaceAll('_', ' '))}</a>
				</li>
			{/each}
		</ul>
	</nav>
</header>
