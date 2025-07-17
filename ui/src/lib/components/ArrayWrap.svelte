<script lang="ts">
	import { capitalizeFirstLetter, delay, writeToClipboard } from '$lib/util';
	import { goto } from '$app/navigation';
	import { onDestroy, onMount } from 'svelte';
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
	import type { IKongEntity, ITooggleableEntityMaybe } from '$lib/types';
	import { base } from '$app/paths';
	import Toggle from './Toggle.svelte';
	import { get, writable, type Writable } from 'svelte/store';
	import { ChevronLeftOutline, ChevronRightOutline } from 'flowbite-svelte-icons';
	import { preferences, triggerPageUpdate } from '$lib/stores';

	let loadParentName = writable($preferences?.loadParentInfo);

	loadParentName.subscribe((v) => {
		const prefs = get(preferences);
		if (!prefs) {
			return;
		}
		prefs.loadParentInfo = v;
		preferences.set(prefs);
	});
	const dispatch = createEventDispatcher();

	export let dataRaw: ITooggleableEntityMaybe[];
	export let type: string;
	export let entity: IKongEntity | undefined = undefined;
	export let pathPrefix: string | undefined = '';
	let displayedFields: string[] = [];

	function updateDisplayedFields() {
		displayedFields = JSON.parse(JSON.stringify(entity?.displayedFields)) ?? [];
		if (!displayedFields.includes(sortBy)) {
			displayedFields.push(sortBy);
			displayedFields = displayedFields;
		}
		console.log(displayedFields);
	}

	let searchText = '';
	interface FilteredEntity extends ITooggleableEntityMaybe {
		enabledWritable: Writable<boolean>;
	}
	let filteredData: any[] = [];

	let arrayStart = 0;
	let arrayEnd = paginationSizeUi;
	let pageNumber = 1;
	let debounce: number = DateTime.now().toUnixInteger();

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
	let sortBy = entity?.sortBy ?? 'updated_at';
	let sortAscending = writable(entity?.sortAscending ?? false);

	function updateEvent() {
		const params = new URLSearchParams(window.location.search);
		if (searchText.length == 0) {
			searchText = params.get('search') ?? '';
		}
		sortBy = params.get('sortBy') ?? sortBy;
		sortAscending.set(params.get('sortAscending') === 'true');

		// filteredData = dataRaw;
		debounce = DateTime.now().toUnixInteger();
		search();
		resetPagination();
		calculatePagination();
		sort(filteredData);
		updateDisplayedFields();
	}

	function sort(arr: any[]) {
		arr.sort((a, b) => {
			let fieldA = a[sortBy];
			let fieldB = b[sortBy];
			if (typeof fieldA == 'object') {
				fieldA = JSON.stringify(fieldA);
				fieldB = JSON.stringify(fieldB);
			}

			if (typeof fieldA == 'string') {
				if ($sortAscending === true) {
					return fieldA.localeCompare(fieldB);
				}
				return fieldB.localeCompare(fieldA);
			}
			if ($sortAscending === true) {
				return (fieldA - fieldB) as number;
			} else {
				return (fieldB - fieldA) as number;
			}
		});
	}

	triggerPageUpdate.subscribe(updateEvent);

	onMount(() => {
		updateEvent();
	});

	async function disable(id: string, newEnabledValue: boolean) {
		const res = await (
			await apiService()
		).updateRecord<ITooggleableEntityMaybe>(type, id, { enabled: newEnabledValue });
		if (res.ok) {
			dispatch('refresh');
			confirmToast(`item ${newEnabledValue ? 'enabled' : 'disabled'}`);
		}
		return res;
	}

	async function deleteEntity(type: string, id: string, name: string) {
		const conf = confirm(`Please confirm deletion of '${name}'`);
		if (!conf) {
			return;
		}
		const res = await (await apiService()).deleteRecord(type, id, pathPrefix);
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

	let searchDebounce: number | undefined = undefined;
	// time after which the search will be written to the url query if unmodified
	let debounceTimeoutMs = 550;
	function updateSearchParamWithDebounce() {
		if (searchDebounce) {
			clearTimeout(searchDebounce);
			searchDebounce = undefined;
		}
		searchDebounce = setTimeout(updateSearchQueryParams, debounceTimeoutMs, { search: searchText });
	}
	onDestroy(() => {
		clearTimeout(searchDebounce);
	});
	function updateSearchQueryParams(map: { [key: string]: string }) {
		const url = new URL(window.location.toString());
		for (const [key, val] of Object.entries(map)) {
			if (val.length > 0) {
				url.searchParams.set(key, val);
			} else {
				url.searchParams.delete(key);
			}
		}

		history.pushState(null, '', url);
	}
	function search() {
		if (searchText.length == 0) {
			filteredData = dataRaw.map((i: any): FilteredEntity => {
				i.enabledWritable = writable(i.enabled);
				return i as FilteredEntity;
			});
		}
		const booleanAndSearch = searchText.split(/\s*&&\s*/);
		// if (booleanAndSearch.length > 1) {
		filteredData = dataRaw.filter((item: any) => {
			for (let condition of booleanAndSearch) {
				condition = condition.trim();
				const isNot = condition.startsWith('!');
				let conditionPassed = false;
				if (isNot) {
					const truthCondition = condition.substring(1).trim();
					if (truthCondition.length > 1) {
						conditionPassed = !JSON.stringify(item)
							.toLowerCase()
							.includes(truthCondition.toLowerCase());
					} else {
						conditionPassed = true;
					}
				} else {
					conditionPassed = JSON.stringify(item).toLowerCase().includes(condition.toLowerCase());
				}
				if (!conditionPassed) return false;
			}
			return true;
		});
		sort(filteredData);
		resetPagination();
		calculatePagination();
	}

	const idToInfo: { [key: string]: string } = {};
	async function getInfo(type: string, id: string, selfIdentifier: string): Promise<string> {
		if (idToInfo[id] == '-1') {
			// the idea is to make a single call per id.
			await delay(200);
			return getInfo(type, id, selfIdentifier);
		}
		if (idToInfo[id]) {
			return idToInfo[id];
		} else {
			idToInfo[id] = '-1';
		}
		const res = await (await apiService()).findRecord<any>(type + 's', id);
		if (!res.ok) {
			errorToast(`Failed to load ${type} for '${selfIdentifier}'. Res. status code: ${res.code}!`);
			throw new Error('failed to load');
		}
		if (res.data.paths && res.data.paths.length > 0) {
			idToInfo[id] = res.data.paths[0];
			return idToInfo[id];
		}
		idToInfo[id] = res.data.name ?? res.data.tags ?? res.data.id;
		return idToInfo[id];
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
					updateSearchParamWithDebounce();
					search();
				}}
				title="Seaches the JSON representation for the given text. &#013; &#013;Logical 'AND' is supported using the '&&' operator.&#013;Ex: 'host && /path'"
				placeholder="search (hover for info)"
			/>
		</div>
		<div class="flex flex-row my-4 pl-1">
			<p class="text-lg mr-3">Load parent entity name</p>
			<Toggle
				isChecked={loadParentName}
				title={'Loads parent entity name if enabled'}
				on:change={async () => {
					loadParentName.set(!get(loadParentName));
				}}
			/>
		</div>
		<div class="flex flex-row items-center space-x-2 pl-1">
			<p class="text-lg">Sort by:</p>
			<select
				bind:value={sortBy}
				on:change={() => {
					updateSearchQueryParams({ sortBy: sortBy });
					updateEvent();
				}}
				class="dark:bg-stone-700 shadow shadow-slate-600 border-none w-52 rounded focus:border-none focus:[box-shadow:none]"
			>
				{#each Object.keys(dataRaw[0] ?? {}) as key}
					<option value={key} selected={key == sortBy}>{key}</option>
				{/each}
			</select>
		</div>
		<div class="m-1 mt-4">
			<Toggle
				isChecked={sortAscending}
				labelLeft="Z->A"
				labelRight="A->Z"
				title={'Controls the sort direction, either ascending or descending'}
				on:change={async () => {
					sortAscending.set(!$sortAscending);
					updateSearchQueryParams({ sortAscending: JSON.stringify(get(sortAscending)) });
					updateEvent();
				}}
			/>
		</div>
		<div class="flex flex-row mt-4">
			<button
				title="copies all entities as JSON"
				on:click={() => {
					const conf = confirm(`confirm copy of ${filteredData.length} entities?`);
					if (!conf) {
						return;
					}
					copy(filteredData);
				}}
				class="flex flex-row items-center dark:bg-stone-700 bg-stone-100 rounded p-1 pr-2 m-1"
			>
				<FileCopyOutline class="m-1" />
				COPY ALL
			</button>
			<button
				title="deletes currently filtered entites"
				class="flex flex-row items-center dark:bg-rose-900 bg-stone-100 rounded p-1 pr-2 m-1"
				on:click={async () => {
					const confirmEach = confirm(`Do you want to confirm each entity's deletion separately?`);
					const conf = confirm(
						`this will delete all entities currently visible: ${filteredData.length} in total`
					);
					if (!conf) {
						return;
					}
					const conf2 = confirm(
						`think twice, this is the last chance to cancel!\n(refresh the page to stop the process)`
					);
					if (!conf2) {
						return;
					}
					for (const entity of filteredData) {
						if (confirmEach) {
							const confirmEntity = confirm(
								`Confirm deletion of:\n ${JSON.stringify(
									{ name: entity.name, tags: entity.tags, id: entity.id },
									undefined,
									2
								)}`
							);
							if (!confirmEntity) {
								continue;
							}
						}
						const res = await (await apiService()).deleteRecord(type, entity.id);
						if (res.ok) {
							infoToast(
								`deleted ${entity.name ?? ''}(${entity.id}) ${
									filteredData.length - filteredData.indexOf(entity)
								} remaining`
							);
						} else {
							errorToast(`failed deletion of ${entity.name ?? entity.id}`);
							errorToast(res.err ?? 'unknown error occured');
							break;
						}
					}
					infoToast('deletion successfully finished! the page will be refreshed soon.');
					dispatch('refresh');
				}}
			>
				<TrashBinOutline class="m-1" />
				DELETE ALL
			</button>
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
					disabled:shadow disabled:shadow-slate-600
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
			<thead
				class="text-stone-800 text-sm dark:bg-stone-800 bg-gray-200 font-bold dark:text-stone-300 h-10"
			>
				<tr>
					<th><p class="pl-4">No.</p></th>
					<th><p class="pl-4">Actions</p></th>
					{#each displayedFields ?? Object.keys(dataRaw[0] ?? {}) as field}
						{#if Object.keys(dataRaw[0] ?? {}).includes(field)}
							<th scope="col" class="pl-4"> {field} </th>
						{/if}
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each filteredData.slice(arrayStart, arrayEnd) as item, index}
					<tr
						class="hoveritem border dark:border-stone-800 rounded"
						on:auxclick={() => {
							window.open(
								`${base}/entity?type=${type}&id=${item.id}&prefix=${pathPrefix}`,
								'_blank'
							);
						}}
					>
						<td class="">
							<p class="text-center font-light pl-3">
								{index + 1 + arrayStart}
							</p></td
						>
						<td class="p-2">
							<div class=" space-x-1 flex flex-row">
								<button
									class="h-8"
									title={JSON.stringify(item, undefined, 2)}
									on:click={() => {
										copy(JSON.stringify(item, undefined, 2));
									}}
								>
									<div class="flex flex-row items-center">
										<FileCopyOutline class="m-1" />
									</div>
								</button>
								<button title="open" class="h-8" color="alternative">
									<a
										href="{base}/entity?type={type}&id={item.id}&prefix={pathPrefix}"
										class="text-emerald-600"
									>
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

						{#each displayedFields ?? Object.keys(dataRaw[0] ?? {}) as field}
							{#if Object.keys(item).includes(field)}
								<td class="p-4">
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
													goto(`${base}/entity?type=${type}&id=${item.id}&prefix=${pathPrefix}`);
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
														<label
															class="inline-flex items-center cursor-pointer"
															title="enable or disable"
														>
															<input
																type="checkbox"
																bind:checked={item.enabled}
																on:change|stopPropagation|preventDefault={async () => {
																	let ok = confirm('confirm action');
																	item.enabled = !item.enabled;
																	if (ok) {
																		const res = await disable(item['id'], !item.enabled);
																		if (res.ok) {
																			console.log(res);
																			item.enabled = res.data?.enabled;
																		} else {
																			errorToast(`Failed to disable. (${res.code}) ${res.err}`);
																		}
																	}
																}}
																class="sr-only peer"
															/>
															<div
																class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"
															></div>
															<!-- <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Toggle me</span> -->
														</label>
													</div>
												{:else}
													{item[field]}
												{/if}
											{:else if typeof item[field] == 'number'}
												{#if dateFields.includes(field)}
													{DateTime.fromSeconds(item[field]).toRelative({ style: 'short' })}
												{:else}
													{item[field]}
												{/if}
											{:else if item[field] && Object.keys(item[field]).includes('id') && kongEntities.find((i) => i.apiPath == `${field}s`)}
												<!-- svelte-ignore a11y-no-static-element-interactions -->
												<div
													class="px-2 py-1 m-2 dark:shadow-slate-800 shadow rounded"
													title="go to {field}"
												>
													<a
														class="w-full"
														on:click|preventDefault={() =>
															goto(
																`${base}/entity?type=${field}s&id=${item[field].id}&prefix=${pathPrefix}`
															)}
														href="{base}/entity?type={field}s&id={item[field]
															.id}&prefix=${pathPrefix}"
														on:auxclick={() => {
															window.open(
																`${base}/entity?type=${field}s&id=${item[field].id}&prefix=${pathPrefix}`,
																'_blank'
															);
														}}
													>
														<div>
															<p class="dark:text-blue-500 text-blue-700 px-1 truncate">
																{#if $loadParentName}
																	{#await getInfo(field, item[field].id, item.name ?? item.id) then value}
																		{value}
																	{:catch}
																		{item[field].id}
																	{/await}
																{:else}
																	{item[field].id}
																{/if}
															</p>
														</div>
													</a>
												</div>
											{:else if Object.is(item[field], null)}
												-
											{:else if Array.isArray(item[field]) && item[field].length == 1}
												<div class="px-2 py-1 m-2 dark:shadow-slate-800 shadow rounded">
													<p>
														{item[field][0]}
													</p>
												</div>
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
					disabled:shadow disabled:shadow-slate-600
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
