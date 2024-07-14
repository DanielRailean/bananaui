<script lang="ts">
	import { isDark } from '$lib/stores';
	import { onMount } from 'svelte';
	export let div_class = '';
	let value = -1;
	import logo from '$lib/assets/favicon.png';

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
		isDark.set(value);
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

		isDark.subscribe((val) => {
			if (!document) {
				console.log('document not defined');
				return;
			}
			let root = document.querySelector(':root') as any;
			if (!root) {
				console.log('no root!');
				return;
			}
			for (const vari of variables) {
				root.style.setProperty(vari, val ? darkColor : lightColor);
			}
		});
	});

	let lightColor = 'rgb(2 6 23)';
	let darkColor = 'lightgray';
	let variables = [
		'--json-tree-string-color',
		'--json-tree-boolean-color',
		'--json-tree-number-color',
		'--json-tree-arrow-color',
		'--json-tree-property-color',
		'--json-tree-label-color',
		'--json-tree-operator-color',
		'--json-tree-number-color',
		'--json-tree-string-color',
		'--json-tree-property-color'
	];
</script>

<div class="cursor-pointer {div_class}" title="toggle dark mode" on:click={handleClick}>
	<img src={logo} alt="bananaui logo" class="w-10 h-10 m-4 {$isDark ? 'invert' : ''}" />
</div>
