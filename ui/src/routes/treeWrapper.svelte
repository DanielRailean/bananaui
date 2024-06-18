<script lang="ts">
	import { isDark } from '$lib/stores';
	import { onMount } from 'svelte';
	import JSONTree from 'svelte-json-tree';
	export let data: any;

	let lightColor = 'black';
	let darkColor = 'white';
	let variables = [
		'--json-tree-string-color',
		'--json-tree-boolean-color',
		'--json-tree-number-color',
		'--json-tree-arrow-color',
		'--json-tree-property-color'
	];
	onMount(() => {
		isDark.subscribe((val) => {
			console.log(val);
			if (!document) {
				return;
			}
			let root = document.querySelector(':root') as any;
			for (const vari of variables) {
				root.style.setProperty(vari, val ? darkColor : lightColor);
			}
		});
	});
</script>

<div class="tree dark:tree-dark">
	{#if data}
		<div class="relative overflow-x-auto">
			<table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
				<thead
					class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
				>
					<tr>
						<th scope="col" class="px-6 py-3"> Field </th>
						<th scope="col" class="px-6 py-3"> Value </th>
					</tr>
				</thead>
				<tbody>
					<!-- content here -->
					{#each Object.entries(data) as [key, value]}
						<tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
							<th
								scope="row"
								class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
							>
								{key}
							</th>
							<td class="px-6 py-4">
								<JSONTree value={data[key]} defaultExpandedLevel={1}></JSONTree>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{:else}
		<h2 class="text-xl text-center">Loading ...</h2>
	{/if}
</div>

<style lang="postcss">
	.tree {
		--json-tree-label-color: green;
		--json-tree-operator-color: gray;
		/*
    --json-tree-symbol-color: white;
    --json-tree-function-color: white;
    --json-tree-null-color: white;
    --json-tree-undefined-color: white;
    --json-tree-date-color: white;
    --json-tree-internal-color: white;
    --json-tree-regex-color: white; */

		--json-tree-li-indentation: 1em;
		--json-tree-li-line-height: 1.3;

		--json-tree-font-size: 12px;
		--json-tree-font-family: 'Courier New', Courier, monospace;
	}
</style>
