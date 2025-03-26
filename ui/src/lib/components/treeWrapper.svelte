<script lang="ts">
	import { goto } from '$app/navigation';
	import { dateFields, kongEntities } from '$lib/config';
	import { writeToClipboard } from '$lib/util';
	import JSONTree from 'svelte-json-tree';
	import { DateTime } from 'luxon';
	import { base } from '$app/paths';
	import { writable } from 'svelte/store';
	import Toggle from './Toggle.svelte';
	import { createEventDispatcher } from 'svelte';
	import { confirmToast, infoToast } from '$lib/toastStore';
	import { apiService } from '$lib/requests';
	export let data: any;
	export let expandLevel = 0;
	export let allowCopy = true;
	export let allowKeyCopy = false;
	export let rounded = true;
	export let type = '';
	export let expandFields = ['config', 'tags'];

	const dispatch = createEventDispatcher();

	async function disable(id: string, current: boolean) {
		const res = await (await apiService()).updateRecord(type, id, { enabled: !current });
		if (res.ok) {
			dispatch('refresh');
			confirmToast(`item ${current ? 'disabled' : 'enabled'}`);
		}
	}

	export let keyClickHandler: ((key: string) => void) | undefined = undefined
	export let keyTitle = (key:string) => {return `copy ${key}`}
</script>

<div class="tree">
	{#if data}
		<div
			class="relative overflow-x-hidden {rounded ? 'rounded-xl' : ''} border-b dark:border-stone-800"
		>
			<table class="w-full text-sm text-left rtl:text-right text-gray-800 dark:text-zinc-300">
				<tbody>
					{#each Object.entries(data) as [key, value]}
						<tr class="bg-white border-t dark:bg-[#1E2021] dark:border-gray-700 hoveritem">
							<th
								on:click={async ()=> {
									if(keyClickHandler)
									{
										await keyClickHandler(key)
									}
								}}
								scope="row"
								class="px-6 py-4 font-medium text-stone-900 whitespace-nowrap dark:text-zinc-300 {allowKeyCopy || keyClickHandler != undefined
									? 'cursor-pointer'
									: ''}"
								title={keyTitle(key) ?? ""}
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
									<a href="{base}/entity?type={key}s&id={data[key].id}" on:click|preventDefault>
										<div
											class=""
											title="open {key}"
											on:click|stopPropagation|preventDefault={() =>
												goto(`${base}/entity?type=${key}s&id=${data[key].id}`)}
										>
											<p class="dark:text-blue-500 text-blue-700">{data[key].id}</p>
										</div>
									</a>
									<!-- </a> -->
									<button
										on:click={() => {
											console.log(data[key]);
										}}
									></button>
								{:else if typeof data[key] == 'object' && data[key] != null && expandFields.includes(key)}
									<div class="cursor-pointer">
										<JSONTree value={data[key]} defaultExpandedLevel={100}></JSONTree>
									</div>
								{:else if typeof data[key] == 'object' && data[key] != null}
									<div class="cursor-pointer">
										<JSONTree value={data[key]} defaultExpandedLevel={expandLevel}></JSONTree>
									</div>
								{:else if typeof data[key] == 'boolean'}
									{#if key === 'enabled'}
										<div on:click|stopPropagation>
											<Toggle
												isChecked={writable(data[key])}
												on:change={async () => {
													let ok = confirm('confirm action');
													if (ok) {
														await disable(data['id'], data[key]);
													}
												}}
											/>
										</div>
									{:else}
										{data[key]}
									{/if}
								{:else if typeof data[key] == 'number'}
									{#if dateFields.includes(key)}
										{DateTime.fromSeconds(data[key]).toLocaleString({
											...DateTime.DATETIME_MED,
											weekday: 'short'
										})}
									{:else}
										{data[key]}
									{/if}
								{:else if data[key] == null}
									-
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
		--json-tree-font-family: 'JetBrains Mono', monospace;
	}
	.hoveritem:hover {
		@apply dark:bg-blue-900 bg-blue-300;
	}
</style>
