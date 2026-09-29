<script lang="ts">
	import { goto } from '$app/navigation';
	import { dateFields } from '$lib/config';
	import { getParentInfo, writeToClipboard } from '$lib/util';
	import JSONTree from 'svelte-json-tree';
	import { afterUpdate } from 'svelte';
	import { DateTime } from 'luxon';
	import { base } from '$app/paths';
	import { get, writable } from 'svelte/store';
	import Toggle from './Toggle.svelte';
	import { createEventDispatcher, onMount } from 'svelte';
	import { confirmToast, infoToast } from '$lib/toastStore';
	import { confirm } from '$lib/confirmStore';
	import { apiService } from '$lib/requests';
	import { preferences } from '$lib/stores';
	import ArrayDisplay from './ArrayDisplay.svelte';
	export let data: any;
	export let expandLevel = 0;
	export let allowCopy = true;
	export let allowKeyCopy = false;
	export let rounded = true;
	export let type = '';
	export let expandFields = ['config', 'tags', 'payload'];

	const dispatch = createEventDispatcher();

	let loadParentName = preferences?.loadParentInfo;

	async function disable(id: string, current: boolean) {
		const res = await (await apiService()).updateRecord(type, id, { enabled: !current });
		if (res.ok) {
			dispatch('refresh');
			confirmToast(`item ${current ? 'disabled' : 'enabled'}`);
		}
	}


	export let keyClickHandler: ((key: string) => void) | undefined = undefined;
	export let keyTitle = (key: string) => {
		return `copy ${key}`;
	};

	let yamlContainer: HTMLElement;
	afterUpdate(() => {
		if (yamlContainer) {
			yamlContainer.querySelectorAll('code.language-json').forEach((el) => {
				(globalThis as any).Prism.highlightElement(el);
			});
		}
	});
</script>

<div class="tree">
	{#if data}
		<div
			class="relative overflow-x-hidden {rounded
				? 'rounded-xl border border-[var(--glass-border)]'
				: ''}"
		>
			<table class="w-full text-sm text-left rtl:text-right text-[var(--text-primary)]">
				<tbody class="divide-y divide-[var(--glass-border)]">
					{#each Object.keys(data).filter((key) => data[key] != null) as key}
						<tr
							class="hover:bg-[var(--accent)]/[0.04] dark:hover:bg-[var(--accent)]/[0.06] transition-colors duration-75 {(typeof data[key] == 'object' && data[key] != null && (expandFields.includes(key) || (Array.isArray(data[key]) && data[key].length > 3))) ? 'align-top' : ''}"
						>
							<th
								on:click={async () => {
									if (keyClickHandler) {
										await keyClickHandler(key);
									}
								}}
								scope="row"
								class="px-5 py-3.5 font-semibold text-[11px] uppercase tracking-wider text-[var(--text-tertiary)] whitespace-nowrap w-[200px] {allowKeyCopy ||
								keyClickHandler != undefined
									? 'cursor-pointer'
									: ''}"
								title={keyTitle(key) ?? ''}
								on:dblclick={() => {
									if (!allowKeyCopy) return;
									writeToClipboard(key);
								}}
							>
								{key}
							</th>
							<td
								class="px-5 py-3.5 flex flex-row select-none items-center text-[var(--text-secondary)] font-mono text-[13px] {allowCopy
									? 'cursor-pointer'
									: ''}"
								title="double-click to copy"
								on:dblclick={() => {
									if (!allowCopy) return;
									writeToClipboard(
										typeof data[key] == 'string' ? data[key] : JSON.stringify(data[key])
									);
								}}
							>
								{#if data[key] && Object.keys(data[key]).includes('id') && get(preferences.kongEntities).find((i) => i.apiPath == `${key}s`)}
									<!-- svelte-ignore a11y-click-events-have-key-events -->
									<!-- svelte-ignore a11y-no-static-element-interactions -->
									<a href="{base}/entity?type={key}s&id={data[key].id}" on:click|preventDefault>
										<div
											class=""
											title="open {key}"
											on:click|stopPropagation|preventDefault={() =>
												goto(`${base}/entity?type=${key}s&id=${data[key].id}`)}
										>
											<p class="dark:text-blue-500 text-blue-700">
												{#if $loadParentName}
													{#await getParentInfo(key, data[key].id) then value}
														{value}
													{:catch}
														{data[key].id}
													{/await}
												{:else}
													{data[key].id}
												{/if}
											</p>
										</div>
									</a>
									<button
										on:click={() => {
											console.log(data[key]);
										}}
									></button>
								{:else if Array.isArray(data[key])}
									<ArrayDisplay
										item={data}
										field={key}
										on:copy={(e) => {
											writeToClipboard(e.detail.value);
										}}
									/>
								{:else if typeof data[key] == 'object' && data[key] != null && expandFields.includes(key)}
									<div class="w-full" bind:this={yamlContainer}>
										<pre class="language-json m-0 p-4 bg-transparent rounded-none"><code class="language-json bg-transparent">{JSON.stringify(data[key], null, 2)}</code></pre>
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
													let ok = await confirm({
														message: 'Confirm toggle?',
														variant: 'warning',
														confirmText: data[key] ? 'Disable' : 'Enable'
													});
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
		--json-tree-label-color: var(--accent, #6366f1);
		--json-tree-string-color: var(--text-secondary, #64748b);
		--json-tree-number-color: var(--text-primary, #1e293b);
		--json-tree-li-indentation: 1em;
		--json-tree-li-line-height: 1.3;

		--json-tree-font-size: 13px;
		--json-tree-font-family: 'JetBrains Mono', monospace;
	}

	.tree pre[class*="language-"],
	.tree code[class*="language-"] {
		font-family: 'JetBrains Mono', monospace !important;
		font-size: 14px;
		line-height: 1.6;
	}
</style>
