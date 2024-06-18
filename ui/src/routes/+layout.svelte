<script>
	import Header from './Header.svelte';
	import './styles.css';
</script>

<div class="flex flex-row min-h-[100vh]">
	<Header />

	<main class="px-[10vw]">
		<slot />
	</main>
</div>

<style>
</style>
