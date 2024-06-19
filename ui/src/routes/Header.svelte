<script>
	import DarkToggle from './DarkToggle.svelte';
	import { page } from '$app/stores';

	let items = [
		{
			name: 'overview',
			path: '/'
		}
	];
	import { onMount } from 'svelte';
	import { entityFields } from '$lib/entities';
	import { staticConfig } from '$lib/config';

	onMount(() => {
		const entities = Object.entries(entityFields).map((i) => {
			return { name: i[0], path: `/${i[0].toLowerCase()}` };
		});
		items = [...items, ...entities];
	});
</script>

<header class="flex flex-col border-r-[1px] dark:border-slate-700 px-8 bg-slate-100 dark:bg-slate-800">
	<div class="flex flex-row items-center my-5">
		<img src="/favicon.png" alt="bananaui logo" class="m-4" /> 
		<h1 class="font-medium text-2xl">{staticConfig.name}</h1>
		<!-- <DarkMode /> -->
		<DarkToggle div_class="" />
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
					<a href={item.path}>{item.name}</a>
				</li>
			{/each}
		</ul>
	</nav>
</header>

<style lang="postcss">
	img {
		@apply w-10 h-10;
	}
</style>
