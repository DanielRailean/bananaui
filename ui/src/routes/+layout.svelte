<script>
	import ConfigLoader from '$lib/components/ConfigLoader.svelte';
	import { userToken } from '$lib/stores';
	import Header from './Header.svelte';
	import Login from './Login.svelte';
	import './styles.css';
</script>

<Login />
<ConfigLoader />
<div class="flex flex-row min-h-[100vh]">
	<Header />

	<main class="px-[5vw] w-full h-full">
		<slot />
	</main>
</div>

<style>
</style>
