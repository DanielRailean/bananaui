<script lang="ts">
	import { isDark } from '$lib/stores';
	import { writeToClipboard } from '$lib/util';
	import { Button } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import JSONTree from 'svelte-json-tree';
	export let data: any;
	export let expandLevel = 0;
</script>

<div class="tree">
	{#if data}
		<div class="relative overflow-x-auto">
			<table class="w-full text-sm text-left rtl:text-right text-gray-800 dark:text-gray-400">
				<thead
					class="text-xs text-gray-800 uppercase bg-slate-300 dark:bg-gray-700 dark:text-gray-400"
				>
					<tr>
						<th scope="col" class="px-6 py-3"> Field </th>
						<th scope="col" class="px-6 py-3"> Value </th>
					</tr>
				</thead>
				<tbody>
					<!-- content here -->
					{#each Object.entries(data) as [key, value]}
						<tr
							class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 even:dark:bg-gray-700 even:bg-slate-200"
						>
							<th
								scope="row"
								class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
							>
								{key}
							</th>
							<td class="px-6 py-4 flex flex-row items-center">
								<JSONTree value={data[key]} defaultExpandedLevel={expandLevel}></JSONTree>
								<Button
									color="alternative"
									class="h-7 ml-5"
									on:click={() => {
										writeToClipboard(
											typeof data[key] == 'string' ? data[key] : JSON.stringify(data[key])
										);
									}}>copy</Button
								>
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

		--json-tree-li-indentation: 1em;
		--json-tree-li-line-height: 1.3;

		--json-tree-font-size: 15px;
		--json-tree-font-family: 'Courier New', Courier, monospace;
	}
</style>
