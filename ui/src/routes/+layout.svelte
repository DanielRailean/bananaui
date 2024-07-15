<script>
	import { staticConfig } from '$lib/config';
	import { page } from '$app/stores';
	import ConfigLoader from '$lib/components/ConfigLoader.svelte';
	import Header from '../lib/components/Header.svelte';
	import Login from '../lib/components/Login.svelte';
	import './styles.css';
	import Toasts from '$lib/components/Toasts.svelte';
</script>

<svelte:head>
	<title>{staticConfig.name}</title>
</svelte:head>

<ConfigLoader />
<Login />
<Toasts />
<div class="flex flex-row min-h-[100vh]">
	{#if !$page.url.pathname.includes('/login')}
		<Header />
	{/if}

	<main class="w-full h-full">
		<div
			class="flex flex-col m-8 shadow shadow-stone-300 dark:shadow-zinc-800 bg-white rounded-xl dark:bg-slate-900 dark:text-slate-50"
		>
			<slot />
		</div>
	</main>
</div>

<style>
</style>
