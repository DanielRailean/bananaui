<script lang="ts">
	import { capitalizeFirstLetter, writeToClipboard } from '$lib/util';
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
	import { addToast, confirmToast, errorToast, infoToast } from '$lib/toastStore';
	import { createEventDispatcher } from 'svelte';
	import type { IKongEntity } from '$lib/types';
	import { base } from '$app/paths';
	import Toggle from './Toggle.svelte';
	import { get, writable } from 'svelte/store';
	import { ChevronLeftOutline, ChevronRightOutline } from 'flowbite-svelte-icons';
	import { triggerPageUpdate } from '$lib/stores';
	import { Button } from 'flowbite-svelte';

	const dispatch = createEventDispatcher();

	export let dataRaw: any[];
	export let type: string;
	export let entity: IKongEntity | undefined = undefined;

	let searchText = '';
	let filteredData: any[] = [];

	let arrayStart = 0;
	let arrayEnd = paginationSizeUi;
	let pageNumber = 1;

	let intervalsIterable: number[] = [];
	let intervals = (dataRaw?.length ?? 0) / paginationSizeUi;

	function calculatePagination() {
		intervalsIterable = [];
		intervals = filteredData.length / paginationSizeUi;

		if (Math.floor(intervals) != intervals) {
			intervals = Math.floor(intervals) + 1;
		}

		for (let index = 0; index < intervals; index++) {
			intervalsIterable[index] = index + 1;
		}
		intervalsIterable = intervalsIterable.slice(0, intervals);
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
	let sortKey = entity?.sortBy ?? 'updated_at';
	let sortAscending = entity?.sortAscending ?? false;

	function updateEvent() {
		if(!get(triggerPageUpdate).startsWith(entity?.name ?? "") )
		{
			return
		}
		filteredData = dataRaw;
		search();
		resetPagination();
		calculatePagination();
		const params = new URLSearchParams(window.location.search);
		searchText = params.get('search') ?? '';
		filteredData = filteredData.sort((a, b) => {
			let fieldA = a[sortKey];
			let fieldB = b[sortKey];
			if (typeof fieldA == 'object') {
				fieldA = JSON.stringify(fieldA);
				fieldB = JSON.stringify(fieldB);
			}

			if (typeof fieldA == 'string') {
				if (sortAscending === true) {
					return fieldA.localeCompare(fieldB);
				}
				return fieldB.localeCompare(fieldA);
			}
			if (sortAscending === true) {
				return (fieldA - fieldB) as number;
			} else {
				return (fieldB - fieldA) as number;
			}
		});
	}

	$: $triggerPageUpdate, updateEvent();

	onMount(() => {
		updateEvent();
	});

	async function disable(id: string, current: boolean) {
		const res = await (await apiService()).updateRecord(type, id, { enabled: !current });
		if (res.ok) {
			dispatch('refresh');
			confirmToast(`item ${current ? 'disabled' : 'enabled'}`);
		}
	}

	async function deleteEntity(type: string, id: string, name: string) {
		const conf = confirm(`Please confirm deletion of '${name}'`);
		if (!conf) {
			return;
		}
		const res = await (await apiService()).deleteRecord(type, id);
		if (!res.ok) {
			errorToast(`failed to delete. ${res.err}`);
		} else {
			confirmToast(`successfully deleted the ${type}`);
		}
		dispatch('refresh');
	}
	function scrollNext() {
		if (arrayEnd >= filteredData.length) {
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
		arrayStart = (page - 1) * paginationSizeUi;
		arrayEnd = page * paginationSizeUi;
		pageNumber = page;
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

	function updateSearchQueryParam() {
		const url = new URL(window.location.toString());
		if (searchText.length > 0) {
			url.searchParams.set('search', searchText);
		} else {
			url.searchParams.delete('search');
		}
		history.pushState(null, '', url);
	}
	function search() {
		if (searchText.length == 0) {
			filteredData = dataRaw;
		}
		const many = searchText.split(/\s*&&\s*/);
		if (many.length > 1) {
			filteredData = dataRaw.filter((item: any) => {
				for (const condition of many) {
					const conditionPassed = JSON.stringify(Object.values(item))
						.toLowerCase()
						.includes(condition.toLowerCase());
					if (!conditionPassed) return false;
				}
				return true;
			});
		} else {
			filteredData = dataRaw.filter((item: any) =>
				JSON.stringify(Object.values(item)).toLowerCase().includes(searchText.toLowerCase())
			);
		}
	}
</script>

<div class="w-full text-sm text-left rtl:text-right text-stone-800 font-light dark:text-stone-300">
	<div class="pl-4 pb-3">
		<h1 class="text-xl mb-3 ml-1 dark:text-zinc-300">
			{filteredData ? filteredData.length : 'Loading'}
			{capitalizeFirstLetter(type)}
		</h1>
		<div class="w-full mb-2">
			<input
				class="bg-transparent text-xl rounded-lg border-none outline-none focus:[box-shadow:none] ml-[-8px] w-full"
				type="text"
				disabled={!(dataRaw && dataRaw.length > 0)}
				bind:value={searchText}
				on:input={() => {
					updateSearchQueryParam();
					search();
				}}
				title="Seaches the JSON representation for the given text. &#013; &#013;Logical 'AND' is supported using the '&&' operator.&#013;Ex: 'host && /path'"
				placeholder="search (hover for info)"
			/>
			<!-- <Button class="ml-4" on:click={sortItems}>sort</Button> -->
		</div>
		<div class="flex flex-row items-center space-x-2 pl-1">
			<p class="text-lg">Sort by:</p>
			<select
				bind:value={sortKey}
				on:change={() => {
					updateEvent();
				}}
				class="dark:bg-stone-700 border-none w-52 rounded focus:border-none focus:[box-shadow:none]"
			>
				{#each Object.keys(dataRaw[0] ?? {}) as key}
					<option value={key} selected={key == sortKey}>{key}</option>
				{/each}
			</select>
			<select
				bind:value={sortAscending}
				on:change={() => {
					updateEvent();
				}}
				class="dark:bg-stone-700 border-none rounded focus:border-none focus:[box-shadow:none]"
			>
				<option value={true} selected={sortAscending}>ascending</option>
				<option value={false} selected={!sortAscending}>descending</option>
			</select>
		</div>
	</div>
	{#if filteredData.length > paginationSizeUi}
	<div class="info py-4 flex flex-row items-center space-x-4 pl-6">
		<button
			disabled={pageNumber == intervalsIterable[0]}
			class="p-2
			bg-stone-300
					dark:bg-stone-700
					disabled:bg-stone-200
					disabled:dark:text-white disabled:dark:bg-stone-800
			"
			on:click={scrollPrevious}
		>
			<ChevronLeftOutline class="size-4" />
		</button>

		{#each intervalsIterable as interval}
			{#if isVisiblePage(interval, pageNumber)}
				<button
					class="p-2
					w-10 h-10 rounded-lg
					bg-stone-300
					dark:bg-stone-700
					disabled:bg-stone-200
					disabled:dark:text-white disabled:dark:bg-stone-800
					"
					on:click={() => {
						loadPage(interval);
					}}
					disabled={pageNumber == interval}
				>
					<p>{interval}</p>
				</button>
			{/if}
			{#if isVisiblePage(interval, pageNumber) && !isVisiblePage(interval + 1, pageNumber) && !(interval == intervalsIterable.at(-1))}
				<p>...</p>
			{/if}
			<!-- content here -->
		{/each}
		<button
			disabled={pageNumber == intervalsIterable.at(-1)}
			class="
			p-2
			bg-stone-300
					dark:bg-stone-700
					disabled:bg-stone-200
					disabled:dark:text-white disabled:dark:bg-stone-800
			"
			on:click={scrollNext}><ChevronRightOutline class="size-4" /></button
		>
		<p class="text-center text-md">showing {arrayStart + 1} to {arrayEnd}</p>
	</div>
	{/if}
	{#if filteredData.length > 0}
		<table class="w-full mb-2">
			<thead class="text-stone-800 text-sm dark:bg-stone-800 bg-gray-200 font-bold dark:text-stone-300">
				<tr>
					<th><p class="pl-4 text-center">No.</p></th>
					<th><p class="pl-4">Actions</p></th>
					{#each entity?.displayedFields ?? Object.keys(dataRaw[0] ?? {}) as field}
						{#if Object.keys(dataRaw[0] ?? {}).includes(field)}
							<th scope="col" class="py-3"> {field} </th>
						{/if}
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each filteredData.slice(arrayStart, arrayEnd) as item, index}
					<tr
						class="hoveritem dark:border-zinc-700 even:bg-stone-200 dark:even:bg-stone-800"
						on:auxclick={() => {
							window.open(`${base}/entity?type=${type}&id=${item.id}`, '_blank');
						}}
					>
						<td class="py-3 pl-4">
							<p class="text-center font-light">
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

						{#each entity?.displayedFields ?? Object.keys(dataRaw[0] ?? {}) as field}
							{#if Object.keys(item).includes(field)}
								<td class="py-3">
									<div class="flex flex-row items-center justify-between">
										<!-- svelte-ignore a11y-click-events-have-key-events -->
										<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
										<p
											class="mr-2 cursor-pointer overflow-hidden max-h-20"
											title={field == 'name'
												? `open ${item.name ?? ''} (${item.id})`
												: `click to copy '${field}'\n${JSON.stringify(item[field], undefined, 2)} `}
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
														...DateTime.DATETIME_SHORT_WITH_SECONDS,
														hour12: false
													})}
												{:else}
													{item[field]}
												{/if}
											{:else if item[field] && Object.keys(item[field]).includes('id') && kongEntities.find((i) => i.apiPath == `${field}s`)}
												<!-- svelte-ignore a11y-no-static-element-interactions -->
												<Button class="h-10 m-1" title="open {field}" color="alternative">
													<a class="w-full"
													on:click|preventDefault={() =>
														goto(`${base}/entity?type=${field}s&id=${item[field].id}`)}
													title="open {field}"
													href="{base}/entity?type={field}s&id={item[field].id}"
													on:auxclick={() => {
														window.open(
															`${base}/entity?type=${field}s&id=${item[field].id}`,
															'_blank'
														);
													}}
												>
												<div>
													<p class="dark:text-blue-500 text-blue-700 px-1 truncate">{item[field].id}</p>
												</div>
											</a>
												</Button>
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
	{/if}
	{#if filteredData.length > paginationSizeUi}
	<div class="info py-4 flex flex-row items-center space-x-4 pl-6">
		<button
			disabled={pageNumber == intervalsIterable[0]}
			class="p-2
			bg-stone-300
					dark:bg-stone-700
					disabled:bg-stone-200
					disabled:dark:text-white disabled:dark:bg-stone-800
			"
			on:click={scrollPrevious}
		>
			<ChevronLeftOutline class="size-4" />
		</button>

		{#each intervalsIterable as interval}
			{#if isVisiblePage(interval, pageNumber)}
				<button
					class="p-2
					w-10 h-10 rounded-lg
					bg-stone-300
					dark:bg-stone-700
					disabled:bg-stone-200
					disabled:dark:text-white disabled:dark:bg-stone-800
					"
					on:click={() => {
						loadPage(interval);
					}}
					disabled={pageNumber == interval}
				>
					<p>{interval}</p>
				</button>
			{/if}
			{#if isVisiblePage(interval, pageNumber) && !isVisiblePage(interval + 1, pageNumber) && !(interval == intervalsIterable.at(-1))}
				<p>...</p>
			{/if}
			<!-- content here -->
		{/each}
		<button
			disabled={pageNumber == intervalsIterable.at(-1)}
			class="
			p-2
			bg-stone-300
					dark:bg-stone-700
					disabled:bg-stone-200
					disabled:dark:text-white disabled:dark:bg-stone-800
			"
			on:click={scrollNext}><ChevronRightOutline class="size-4" /></button
		>
		<p class="text-center text-md">showing {arrayStart + 1} to {arrayEnd}</p>
	</div>
	{/if}
</div>

<style lang="postcss">
	.hoveritem:hover {
		@apply dark:bg-blue-900 bg-blue-300;
	}
</style>
