<script lang="ts">
	import { writeToClipboard } from '$lib/util';
	import { goto } from '$app/navigation';
	import { Button } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { DateTime } from 'luxon';
	import {
		ArrowUpRightFromSquareOutline,
		FileCopyOutline,
		TrashBinOutline
	} from 'flowbite-svelte-icons';
	import { dateFields, kongEntities, paginationSizeUi } from '$lib/config';
	import { apiService } from '$lib/requests';
	import { addToast, infoToast, triggerSort } from '$lib/stores';
	import { createEventDispatcher } from 'svelte';
	import type { IKongEntity } from '$lib/types';
	import { base } from '$app/paths';
	import Toggle from './Toggle.svelte';
	import { writable } from 'svelte/store';

	import { createPagination, melt } from '@melt-ui/svelte';
	import { ChevronLeftOutline, ChevronRightOutline } from 'flowbite-svelte-icons';

	const dispatch = createEventDispatcher();

	export let data: any[];
	export let type: string;
	export let entity: IKongEntity | undefined = undefined;

	function copy(data: any) {
		let result = JSON.stringify(data, undefined, 2);
		if (typeof data == 'string') {
			result = data;
		}
		if (Array.isArray(data) && data.length == 1) {
			const first = data[0];
			if (typeof first == 'string') {
				result = data[0];
			} else {
				result = JSON.stringify(data[0], undefined, 2);
			}
		}
		writeToClipboard(result);
	}

	function updateEvent() {
		resetPagination();
		data = data.sort((a, b) => {
			if (entity && entity.sortBy) {
				const sortKey = entity.sortBy;
				if (entity.sortAscending === true) {
					return (a[sortKey] - b[sortKey]) as number;
				} else {
					return (b[sortKey] - a[sortKey]) as number;
				}
			}
			return b.updated_at - a.updated_at;
		});
	}

	$: $triggerSort, updateEvent();

	onMount(() => {
		updateEvent();
	});

	async function disable(id: string, current: boolean) {
		const res = await (await apiService()).updateRecord(type, id, { enabled: !current });
		if (res.ok) {
			dispatch('refresh');
			infoToast(`item ${current ? 'disabled' : 'enabled'}`);
		}
	}

	async function deleteEntity(type: string, id: string, name: string) {
		const conf = confirm(`Please confirm deletion of '${name}'`);
		if (!conf) {
			return;
		}
		const res = await (await apiService()).deleteRecord(type, id);
		if (!res.ok) {
			addToast({ message: `failed to delete. ${res.err}` });
		} else {
			addToast({ message: `successfully deleted the ${type}`, type: `info` });
		}
		dispatch('refresh');
	}
	const {
		elements: { root, pageTrigger, prevButton, nextButton },
		states: { pages, range, page }
	} = createPagination({
		count: data.length,
		perPage: paginationSizeUi,
		defaultPage: 1,
		siblingCount: 1
	});

	function resetPagination() {
		page.set(1);
	}
</script>

<div class="w-full text-sm text-left rtl:text-right text-stone-800 dark:text-stone-400">
	<nav class="flex flex-row items-center ml-4 gap-4 mb-3" aria-label="pagination" use:melt={$root}>
		<div class="flex items-center gap-2">
			<button
				class="grid h-8 items-center rounded-md bg-stone-200 dark:bg-stone-800 px-3 text-sm text-magnum-900 shadow-sm
      hover:opacity-75 disabled:cursor-not-allowed disabled:opacity-50 data-[selected]:bg-magnum-900
      data-[selected]:text-black data-[selected]:dark:text-white"
				use:melt={$prevButton}><ChevronLeftOutline class="size-4" /></button
			>
			{#each $pages as page (page.key)}
				{#if page.type === 'ellipsis'}
					<span>...</span>
				{:else}
					<button
						class="grid h-8 items-center rounded-md bg-stone-200 dark:bg-stone-800 px-3 text-sm text-magnum-900 shadow-sm
          hover:opacity-75 disabled:cursor-not-allowed disabled:opacity-50 data-[selected]:bg-magnum-900
        data-[selected]:text-black data-[selected]:dark:text-white"
						use:melt={$pageTrigger(page)}>{page.value}</button
					>
				{/if}
			{/each}
			<button
				class="grid h-8 items-center rounded-md bg-stone-200 dark:bg-stone-800 px-3 text-sm text-magnum-900 shadow-sm
      hover:opacity-75 disabled:cursor-not-allowed disabled:opacity-50 data-[selected]:bg-magnum-900
    data-[selected]:text-white"
				use:melt={$nextButton}><ChevronRightOutline class="size-4" /></button
			>
		</div>
		Showing {type}
		{$range.start + 1} - {$range.end}
	</nav>
	<table class="w-full">
		<thead class="text-stone-800 dark:bg-stone-800 bg-gray-200 dark:text-stone-400">
			<tr>
				<th><p class="pl-4">No.</p></th>
				<th><p class="pl-4">Actions</p></th>
				{#each entity?.displayedFields ?? Object.keys(data[0]) as field}
					{#if Object.keys(data[0]).includes(field)}
						<th scope="col" class="py-3"> {field} </th>
					{/if}
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each data.slice($range.start, $range.end) as item, index}
				<tr
					class="hoveritem dark:border-zinc-700 even:bg-stone-200 dark:even:bg-stone-800"
					on:auxclick={() => {
						window.open(`${base}/entity?type=${type}&id=${item.id}`, '_blank');
					}}
				>
					<td class="py-3">
						<p class="text-center">
							{index + 1 + $range.start}
						</p></td
					>
					<td class="py-3">
						<div class=" space-x-1 flex flex-row">
							<button
								class="h-8"
								title="copy entire object as json"
								on:click={() => {
									copy(JSON.stringify(item));
								}}
							>
								<div class="flex flex-row items-center">
									<FileCopyOutline class="m-1" />
								</div>
							</button>
							<button title="open" class="h-8" color="alternative">
								<a href="{base}/entity?type={type}&id={item.id}" class="text-emerald-600">
									<div class="flex flex-row items-center">
										<ArrowUpRightFromSquareOutline class="m-1" />
									</div>
								</a>
							</button>
							<button
								class="h-8"
								title="delete"
								on:click={async () =>
									await deleteEntity(entity?.name ?? '', item.id, item.name ?? item.id)}
							>
								<div class="text-rose-500">
									<div class="flex flex-row items-center">
										<TrashBinOutline class="m-1" />
									</div>
								</div>
							</button>
						</div>
					</td>

					{#each entity?.displayedFields ?? Object.keys(data[0]) as field}
						{#if Object.keys(item).includes(field)}
							<td class="py-3">
								<div class="flex flex-row items-center justify-between">
									<!-- svelte-ignore a11y-click-events-have-key-events -->
									<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
									<p
										class="mr-2 cursor-pointer"
										title={field == 'name'
											? `open ${item.name ?? ''} (${item.id})`
											: `click to copy '${field}'`}
										on:click|stopPropagation={() => {
											if (field == 'name') {
												goto(`${base}/entity?type=${type}&id=${item.id}`);
												return;
											}
											copy(item[field]);
										}}
									>
										{#if typeof item[field] == 'string'}
											{item[field]}
										{:else if typeof item[field] == 'boolean'}
											{#if field === 'enabled'}
												<div on:click|stopPropagation>
													<Toggle
														isChecked={writable(item[field])}
														on:change={async () => {
															let ok = confirm('confirm action');
															if (ok) {
																await disable(item['id'], item[field]);
															}
														}}
													/>
												</div>
											{:else}
												{item[field]}
											{/if}
										{:else if typeof item[field] == 'number'}
											{#if dateFields.includes(field)}
												{DateTime.fromSeconds(item[field]).toLocaleString({
													...DateTime.DATETIME_MED,
													weekday: 'short'
												})}
											{:else}
												{item[field]}
											{/if}
										{:else if item[field] && Object.keys(item[field]).includes('id') && kongEntities.find((i) => i.apiPath == `${field}s`)}
											<!-- svelte-ignore a11y-no-static-element-interactions -->
											<a
												on:click|preventDefault={() =>
													goto(`${base}/entity?type=${field}s&id=${item[field].id}`)}
												title="open {field}"
												href="{base}/entity?type={field}s&id={item[field].id}"
											>
												<div>
													<p class="dark:text-blue-500 text-blue-700">{item[field].id}</p>
												</div>
											</a>
										{:else if Object.is(item[field], null)}
											-
										{:else}
											{JSON.stringify(item[field], undefined, 2)}
										{/if}
									</p>
								</div></td
							>
						{/if}
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style lang="postcss">
	.hoveritem:hover {
		@apply dark:bg-blue-900 bg-blue-300;
	}
</style>
