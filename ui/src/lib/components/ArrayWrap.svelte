<script lang="ts">
	import { writeToClipboard } from '$lib/util';
	import { goto } from '$app/navigation';
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
	import { ChevronLeftOutline, ChevronRightOutline } from 'flowbite-svelte-icons';

	const dispatch = createEventDispatcher();

	export let data: any[];
	export let type: string;
	export let entity: IKongEntity | undefined = undefined;

	let arrayStart = 0;
	let arrayEnd = paginationSizeUi;
	let pageNumber = 1;

	let intervalsIterable: number[] = [];
	let intervals = data.length / paginationSizeUi;

	function calculatePagination() {
		intervals = data.length / paginationSizeUi;

		if (Math.floor(intervals) != intervals) {
			intervals = Math.floor(intervals) + 1;
		}

		for (let index = 0; index < intervals; index++) {
			intervalsIterable[index] = index + 1;
		}
	}

	calculatePagination();

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
		calculatePagination();
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
	function scrollNext() {
		if (arrayEnd >= data.length) {
			return;
		}
		pageNumber += 1;
		arrayStart = arrayEnd;
		arrayEnd = arrayEnd + paginationSizeUi;
	}
	function scrollPrevious() {
		if (arrayStart < paginationSizeUi) {
			return;
		}
		pageNumber -= 1;
		arrayStart = arrayStart - paginationSizeUi;
		arrayEnd = arrayEnd - paginationSizeUi;
	}
	function resetPagination() {
		arrayStart = 0;
		pageNumber = 1;
		arrayEnd = paginationSizeUi;
	}

	function loadPage(page: number) {
		arrayStart = (page -1) * paginationSizeUi
		arrayEnd = page * paginationSizeUi
		pageNumber = page;
		console.log(page);
	}

	function isVisiblePage(page: number, currentPage: number): boolean {
		if (currentPage < 4 && page <= 4) {
			return true;
		}
		const last = intervalsIterable.at(-1) ?? currentPage;
		if (page === 1 || page === last) {
			return true;
		}
		if ((currentPage === last || currentPage === last - 1) && page > last - 4) {
			return true;
		}
		if (Math.abs(currentPage - page) <= 1) {
			return true;
		}
		return false;
	}
</script>

<div class="w-full text-sm text-left rtl:text-right text-stone-800 dark:text-stone-300">
	<div class="info p-2 m-2 flex flex-row items-center space-x-4">
		<button class="p-2 dark:bg-stone-700" on:click={scrollPrevious}>
			<ChevronLeftOutline class="size-4" />
		</button>

		{#each intervalsIterable as interval, index}
			{#if isVisiblePage(interval, pageNumber)}
				<button
					class="p-2 dark:bg-stone-700 w-10 h-10 rounded-lg font-medium"
					on:click={() => {
						loadPage(interval);
					}}
				>
					<p>{interval}</p>
				</button>
			{/if}
			{#if isVisiblePage(interval, pageNumber) && !isVisiblePage(interval + 1, pageNumber) && !(interval == intervalsIterable.at(-1))}
				<p>...</p>
			{/if}
			<!-- content here -->
		{/each}
		<button class="p-2 dark:bg-stone-700" on:click={scrollNext}
			><ChevronRightOutline class="size-4" /></button
		>
		<p class="w-36 text-center text-md">showing {arrayStart + 1} to {arrayEnd}</p>
	</div>
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
			{#each data.slice(arrayStart, arrayEnd) as item, index}
				<tr
					class="hoveritem dark:border-zinc-700 even:bg-stone-200 dark:even:bg-stone-800"
					on:auxclick={() => {
						window.open(`${base}/entity?type=${type}&id=${item.id}`, '_blank');
					}}
				>
					<td class="py-3 pl-4">
						<p class="text-center font-bold">
							{index + 1 + arrayStart}
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
