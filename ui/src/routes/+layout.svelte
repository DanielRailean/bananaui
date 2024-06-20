<script>
	import { addToast } from '$lib/stores';
	import { staticConfig } from '$lib/config';
	import { page } from '$app/stores';
	import ConfigLoader from '$lib/components/ConfigLoader.svelte';
	import { userToken } from '$lib/stores';
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

	<main class="w-full h-[100vh]">
		<slot />
	</main>
</div>

<style>
</style>
