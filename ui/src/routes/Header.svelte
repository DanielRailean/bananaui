<script>
	import DarkToggle from './DarkToggle.svelte';
	import { page } from '$app/stores';
	import logo from '$lib/images/svelte-logo.svg';
	import github from '$lib/images/github.svg';
	let items = [
		{
			name: "overview",
			path: "/"
		},
		
	]
import { DarkMode, P } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { entityFields } from '$lib/entities';

onMount(()=> {
	const entities = Object.entries(entityFields).map(i=> {return {name: i[0], path: `/${i[0].toLowerCase()}`}} )
	items = [...items, ...entities]
})
</script>

<header class="flex flex-col mb-4">
	<div class="flex flex-row items-center">
		<img src="/favicon.png" alt="bananaui logo" class="m-4">
		<!-- <DarkMode /> -->
		<DarkToggle/>
	</div>

	<nav class="text-2xl text-slate-400">
		<ul class="flex flex-col">
			{#each items as item}
				<li class="mx-4 hover:text-slate-200 mt-2 {$page.url.pathname === item.path ? "text-slate-50": ""}"><a href="{item.path}">{item.name}</a></li>
			{/each}
		</ul>
	</nav>

</header>

<style lang="postcss">
	img {
		@apply w-10 h-10;
	}


</style>
