<script>
	import { staticConfig } from '$lib/config';
	import { page } from '$app/stores';
	import ConfigLoader from '$lib/components/ConfigLoader.svelte';
	import { userToken } from '$lib/stores';
	import Header from './Header.svelte';
	import Login from './Login.svelte';
	import './styles.css';
</script>

<svelte:head>
	<title>{staticConfig.name}</title>
</svelte:head>

<Login />
<ConfigLoader />
<div class="flex flex-row min-h-[100vh]">
	{#if !$page.url.pathname.includes("/login") }
		 <Header />
	{/if}

	<main class="w-full h-[100vh]">
		<slot />
	</main>
</div>

<style>
</style>
