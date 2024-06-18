<script>
	import { isDark } from '$lib/stores';
	import { onMount } from 'svelte';

	let value = -1;

	const handleDark = () => {
		if (!localStorage.theme) {
			if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
				document.documentElement.classList.add('dark');
				value = 1;
			} else {
				document.documentElement.classList.remove('dark');
				value = 0;
			}
		} else {
			if (localStorage.theme === 'dark') {
				document.documentElement.classList.add('dark');
				value = 1;
			} else {
				document.documentElement.classList.remove('dark');
				value = 0;
			}
		}
    isDark.set(value)
	};

	const handleClick = () => {
		value++;
		if (value > 1) {
			value = 0;
		}
		if (value == 0) {
			localStorage.theme = 'light';
		}
		if (value == 1) {
			localStorage.theme = 'dark';
		}
		handleDark();
	};

	onMount(() => {
		handleDark();
		setInterval(() => {
			handleDark();
		}, 500);
	});
</script>

<div class="h-10">
	{#if value === 0}
		<p on:click={handleClick}>light</p>
	{:else if value === 1}
		<p on:click={handleClick}>dark</p>
	{/if}
</div>
