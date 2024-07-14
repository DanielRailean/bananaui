<script lang="ts">
	import { goto } from '$app/navigation';
	import { dateFields, kongEntities } from '$lib/config';
	import { writeToClipboard } from '$lib/util';
	import JSONTree from 'svelte-json-tree';
	import { DateTime } from 'luxon';
	import { base } from '$app/paths';
	export let data: any;
	export let expandLevel = 0;
	export let allowCopy = true;
	export let allowKeyCopy = false;
	export let rounded = true;
</script>

<div class="tree">
	{#if data}
		<div
			class="relative overflow-x-auto {rounded ? 'rounded-xl' : ''} border-b dark:border-slate-800"
		>
			<table class="w-full text-sm text-left rtl:text-right text-gray-800 dark:text-zinc-300">
				<!-- <thead
					class="text-xs text-gray-800 uppercase bg-slate-100 dark:bg-gray-900 dark:text-gray-400"
				>
					<tr>
						<th scope="col" class="px-6 py-3"> Key </th>
						<th scope="col" class="px-6 py-3"> Value </th>
					</tr>
				</thead> -->
				<tbody>
					{#each Object.entries(data) as [key, value]}
						<tr class="bg-white border-t dark:bg-gray-900 dark:border-gray-700">
							<th
								scope="row"
								class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-zinc-300 {allowKeyCopy
									? 'cursor-pointer'
									: ''}"
								title={allowKeyCopy ? `copy ${key}` : ''}
								on:click={() => {
									if (!allowKeyCopy) return;
									writeToClipboard(key);
								}}
							>
								{key}
							</th>
							<td
								class="px-6 py-4 flex flex-row items-center {allowCopy ? 'cursor-pointer' : ''}"
								title="click to copy"
								on:click={() => {
									if (!allowCopy) return;
									writeToClipboard(
										typeof data[key] == 'string' ? data[key] : JSON.stringify(data[key])
									);
								}}
							>
								{#if data[key] && Object.keys(data[key]).includes('id') && kongEntities.find((i) => i.apiPath == `${key}s`)}
									<!-- svelte-ignore a11y-click-events-have-key-events -->
									<!-- svelte-ignore a11y-no-static-element-interactions -->
									<div
										class=""
										on:click|stopPropagation={() => goto(`${base}/entity?type=${key}s&id=${data[key].id}`)}
									>
										<p class="dark:text-blue-500 text-blue-700">{data[key].id}</p>
									</div>
									<!-- </a> -->
								{:else if typeof data[key] == 'object' && data[key] != null}
									<div class="cursor-pointer">
										<JSONTree value={data[key]} defaultExpandedLevel={expandLevel}></JSONTree>
									</div>
								{:else if typeof data[key] == 'number'}
									{#if dateFields.includes(key)}
										{DateTime.fromSeconds(data[key]).toLocaleString({
											...DateTime.DATETIME_MED,
											weekday: 'short'
										})}
									{:else}
										{data[key]}
									{/if}
								{:else}
									{data[key]}
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
		/* change colors in DarkToggle.svelte */
		--json-tree-li-indentation: 1em;
		--json-tree-li-line-height: 1.3;

		--json-tree-font-size: 15px;
		--json-tree-font-family: 'Courier New', Courier, monospace;
	}
</style>
