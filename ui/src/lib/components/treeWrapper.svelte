<script lang="ts">
	import { goto } from '$app/navigation';
	import { kongEntities } from '$lib/config';
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
							<td
								class="px-6 py-4 flex flex-row items-center cursor-pointer"
								title="click to copy"
								on:click={() => {
									writeToClipboard(
										typeof data[key] == 'string' ? data[key] : JSON.stringify(data[key])
									);
								}}
							>
								{#if data[key] && Object.keys(data[key]).includes('id') && kongEntities.find((i) => i.apiPath == `${key}s`)}
									<!-- svelte-ignore a11y-click-events-have-key-events -->
									<!-- svelte-ignore a11y-no-static-element-interactions -->
									<!-- <a title="open" href="/{key}s/{data[key].id}"> -->
									<div class="" on:click|stopPropagation={() => goto(`/${key}s/${data[key].id}`)}>
										<p class="dark:text-blue-500 text-blue-700">{data[key].id}</p>
									</div>
									<!-- </a> -->
								{:else}
									<div class="cursor-pointer">
										<JSONTree value={data[key]} defaultExpandedLevel={expandLevel}></JSONTree>
									</div>
								{/if}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
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
