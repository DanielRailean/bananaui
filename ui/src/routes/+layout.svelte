<script>
	import Header from './Header.svelte';
	import './styles.css';
</script>

<div class="flex flex-row min-h-[100vh]">
	<Header />

	<main class="px-[5vw] w-full h-full">
		<slot />
	</main>
</div>

<style>
</style>
