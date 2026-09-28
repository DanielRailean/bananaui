<script lang="ts">
	import Link from './Link.svelte';
	import { capitalizeFirstLetter, debouncedCall, delay, getParentInfo, parentInfoCache, writeToClipboard } from '$lib/util';
	import { goto } from '$app/navigation';
	import { onDestroy, onMount } from 'svelte';
	import { DateTime } from 'luxon';
	import {
		CaretDownOutline,
		FileCopyOutline,
		OrderedListOutline,
		TrashBinOutline
	} from 'flowbite-svelte-icons';
	import { dateFields, yamlDumpOptions } from '$lib/config';
	import { apiService, clearCache } from '$lib/requests';
	import { addToast, confirmToast, errorToast, infoToast } from '$lib/toastStore';
	import { confirm } from '$lib/confirmStore';
	import { createEventDispatcher } from 'svelte';
	import type { IKongEntity, ITooggleableEntityMaybe } from '$lib/types';
	import { base } from '$app/paths';
	import Toggle from './Toggle.svelte';
	import { get, writable, type Writable } from 'svelte/store';
	import { ChevronLeftOutline, ChevronRightOutline } from 'flowbite-svelte-icons';
	import { preferences } from '$lib/stores';
	import { Button } from 'flowbite-svelte';
	import { dump } from 'js-yaml';
	import { page } from '$app/stores';
	import ArrayDisplay from './ArrayDisplay.svelte';
	import { doSearch } from '$lib/search';

	let loadParentName = preferences?.loadParentInfo;
	let useFuzzySearch = preferences?.useFuzzySearch;
	const dispatch = createEventDispatcher();

	export let dataRaw: Writable<ITooggleableEntityMaybe[]>;
	export let type: string;
	export let entity: IKongEntity | undefined;
	export let pathPrefix: string | undefined = '';
	let displayedFields: string[] = [];

	function updateDisplayedFields() {
		displayedFields = JSON.parse(JSON.stringify(entity?.displayedFields ?? []));
		if (!displayedFields.includes(sortByField)) {
			displayedFields.push(sortByField);
			displayedFields = displayedFields;
		}
	}
	let isMounted = false;
	let searchText = '';
	interface FilteredEntity extends ITooggleableEntityMaybe {
		enabledWritable: Writable<boolean>;
	}
	let filteredData: any[] = [];

	let paginationSizeUi = get(preferences.paginationSizeUi);
	let arrayStart = 0;
	let arrayEnd = paginationSizeUi;
	let pageNumber = 1;
	let debounce: number = DateTime.now().toUnixInteger();

	let intervalsIterable: number[] = [];
	let intervals = ($dataRaw?.length ?? 0) / paginationSizeUi;

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

	function copyYamlOrJson(format: 'yaml' | 'json', data: any) {
		if (Array.isArray(data)) {
			data.forEach((el) => (el.enabledWritable = undefined));
		}
		if (Object.keys(data).length > 0 && typeof data == 'object') {
			data.enabledWritable = undefined;
		}
		if (format == 'yaml') {
			writeToClipboard(dump(data, yamlDumpOptions), ' YAML');
		}
		if (format == 'json') {
			copy(data);
		}
	}

	let debouncedCopy = debouncedCall(copyYamlOrJson, 510);
	let debouncedCopyAllConfirm = debouncedCall(async (format: 'yaml' | 'json') => {
		const conf = await confirm({
			message: `confirm ${format.toUpperCase()} copy of ${filteredData.length} entities?`,
			variant: 'info',
			confirmText: 'Copy'
		});
		if (!conf) {
			return;
		}
		const data = filteredData.map((i) => {
			i.enabledWritable = undefined;
			return i;
		});
		copyYamlOrJson(format, data);
	}, 510);

	let updateSearchParamWithDebounce = debouncedCall((map: { [key: string]: string }) => {
		const url = new URL(window.location.toString());
		for (const [key, val] of Object.entries(map)) {
			if (val.length > 0) {
				url.searchParams.set(key, val);
			} else {
				url.searchParams.delete(key);
			}
		}

		history.pushState(null, '', url);
	}, 550);

	calculatePagination();

	function copy(data: any) {
		if (Array.isArray(data)) {
			data.forEach((el) => (el.enabledWritable = undefined));
		}
		if (Object.keys(data).length > 0 && typeof data == 'object') {
			data.enabledWritable = undefined;
		}
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
		writeToClipboard(result, ' JSON');
	}
	let sortByField = entity?.sortBy ?? 'updated_at';
	let sortAscending = writable(entity?.sortAscending ?? false);

	// this is to handle initial store event
	function updateEventOnTrigger(v: any[]) {
		console.log(`page update requested by data change items no: ${v.length}`);
		updateEvent('data change');
	}

	function updateEvent(caller = '') {
		console.log(`update called by '${caller}'`);
		if (!isMounted) {
			console.log('not mounted yet, skipping update');
			return;
		}
		const params = new URLSearchParams(window.location.search);
		if (searchText.length == 0) {
			searchText = params.get('search') ?? '';
		}
		sortByField = params.get('sortBy') ?? entity?.sortBy ?? sortByField;
		sortAscending.set(params.get('sortAscending') === 'true');

		debounce = DateTime.now().toUnixInteger();
		search();
		if (get(preferences.sortSearchedItemsDuringPaginationProcess)) {
			sort(filteredData, `update event ${type}`);
		}
		resetPagination();
		calculatePagination();
		updateDisplayedFields();
	}

	// TODO maybe a config param for this
	// page.subscribe(v=> {
	// 	searchText = ""
	// })

	function sort(arr: any[], caller = '') {
		console.log(`sort called by '${caller}'`);
		arr.sort((a, b) => {
			let fieldA = a[sortByField];
			let fieldB = b[sortByField];
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

	dataRaw.subscribe(updateEventOnTrigger);

	onMount(() => {
		isMounted = true;
		updateEvent('on mount');
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
		const conf = await confirm({
			title: 'Delete entity',
			message: `Please confirm deletion of '${name}'`,
			variant: 'danger',
			confirmText: 'Delete'
		});
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
	// {
	// [and inside here]
	// []
	// or between those
	// []
	// }

	function search() {
		if (searchText.length == 0) {
			sort(get(dataRaw), `search ${type}`);
			filteredData = $dataRaw.map((i: any): FilteredEntity => {
				if (i.enabled != undefined) {
					i.enabledWritable = writable(i.enabled);
				}
				return i as FilteredEntity;
			});
		} else {
			filteredData = doSearch(searchText, $dataRaw, get(useFuzzySearch));
		}
		resetPagination();
		calculatePagination();
	}

	let debouncedSearch = debouncedCall(search, 200);



	let editorWindow: HTMLTextAreaElement;
	let editorSyntax: HTMLElement;
	let json = JSON.stringify({ patch_key: 'patch_val' }, undefined, 2);

	const max = 5;
	async function triggerHighlight(selfCalled = 0) {
		if (selfCalled > max) {
			errorToast('highlight not triggered!');
			return;
		}
		json = json.replace(/\t/g, '  ');
		json = json.replace(/\s\n$/g, '\n ');

		if (!editorSyntax) {
			// needed as sometimes the function is called before the editor is added to the DOM
			await delay(5);
			await triggerHighlight(selfCalled + 1);
			return;
		}
		editorSyntax.textContent = json;
		(globalThis as any).Prism.highlightElement(editorSyntax);
		console.log(`Triggered on try ${selfCalled}`);
	}

	function formatBulkJson(): boolean {
		try {
			const parsed = JSON.parse(json);
			json = JSON.stringify(parsed, undefined, 2);
			triggerHighlight();
			confirmToast('json is valid');
			return true;
		} catch (err: any) {
			errorToast(`Failed to parse JSON. ${err.message}`);
			return false;
		}
	}

	async function applyBulkUpdate() {
		if (!formatBulkJson()) return;
		bulkUpdateOpened = false;
		const updateBody = JSON.parse(json);
		const total = filteredData.length;
		for (let i = 0; i < total; i++) {
			const element = filteredData[i];
			const res = await (await apiService()).updateRecord(type, element.id, updateBody);
			if (!res.ok) {
				errorToast(`[${i + 1}/${total}] failed to update ${element.id}. ${res.err}`);
			} else {
				infoToast(`[${i + 1}/${total}] updated ${element.name ?? element.id}`);
			}
		}
		infoToast(`bulk update finished (${total} entities)`);
		clearCache(type);
		dispatch('refresh');
	}
	let bulkUpdateOpened = false;

	onDestroy(() => {
		updateSearchParamWithDebounce.cancel();
		debouncedCopy.cancel();
		debouncedCopyAllConfirm.cancel();
		debouncedSearch.cancel();
	});

	function setTextareaHeight() {
		if (!editorWindow) {
			return;
		}
		editorWindow.style.height = editorWindow.scrollHeight + 3 + 'px';
	}

	const paginationClasses = `btn-icon h-8 w-8 rounded-lg glass`;

	let searchInputEl: HTMLInputElement;
	let highlightedRow = -1;

	function handleGlobalKey(e: KeyboardEvent) {
		if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;
		if (e.key === '/') {
			e.preventDefault();
			searchInputEl?.focus();
		} else if (e.key === 'j' && filteredData.length > 0) {
			e.preventDefault();
			highlightedRow = Math.min(highlightedRow + 1, filteredData.slice(arrayStart, arrayEnd).length - 1);
		} else if (e.key === 'k' && filteredData.length > 0) {
			e.preventDefault();
			highlightedRow = Math.max(highlightedRow - 1, 0);
		} else if (e.key === 'Enter' && highlightedRow >= 0) {
			e.preventDefault();
			const item = filteredData.slice(arrayStart, arrayEnd)[highlightedRow];
			if (item) goto(`${base}/entity?type=${type}&id=${item.id}&prefix=${pathPrefix}`);
		}
	}
</script>

<svelte:window on:keydown={handleGlobalKey} />

<div class="w-full text-sm text-left rtl:text-right text-[var(--text-primary)]">
	<div class="px-4 pt-3 pb-2">
		<p class="text-sm text-[var(--text-secondary)] font-medium">
			{filteredData ? filteredData.length : '…'} items
		</p>
	</div>

	<div class="w-full px-4 py-2">
		<input
			bind:this={searchInputEl}
			class="input-field"
			style="font-variant-ligatures: none;"
			type="text"
			disabled={!($dataRaw && $dataRaw.length > 0)}
			bind:value={searchText}
			on:emptied={() => {
			}}
			on:input={() => {
				updateSearchParamWithDebounce({ search: searchText });
				debouncedSearch();
			}}
			on:keydown={(e) => { if (e.key === 'Escape') { e.preventDefault(); searchInputEl?.blur(); } }}
			title="Filter entities using search DSL. See Reference page for full syntax (&&, ||, !, .len ==, .len !=, comma groups)."
			placeholder="Search or filter… (press / to focus, Esc to unfocus)"
		/>
	</div>
	{#if searchText != '' && useFuzzySearch}
		<div class="px-4 pb-4">
			<Toggle
				isChecked={useFuzzySearch}
				title={'Fuzzy search (typo-tolerant) instead of exact DSL matching'}
				on:change={async () => {
					useFuzzySearch.set(!get(useFuzzySearch));
					search();
				}}
				labelRight="Fuzzy text match"
			/>
		</div>
	{/if}
	{#if filteredData.length > 0}
		<div class="flex flex-row w-full pb-2 justify-between items-center">
			<div class="flex flex-row items-center gap-2 px-4">
				<select
					title="chose the field used to sort the items"
					class="input-field max-w-48 cursor-pointer"
					bind:value={sortByField}
					on:change={() => {
						updateSearchParamWithDebounce.flush({ sortBy: sortByField });
						updateEvent('select sort by');
					}}
				>
					{#each Object.keys($dataRaw[0] ?? {}) as key}
						<option value={key} selected={key == sortByField}
							>{capitalizeFirstLetter(key).replaceAll('_', ' ')}</option
						>
					{/each}
				</select>
				<div class="h-10 flex items-center glass px-3 rounded-xl">
					<Toggle
						isChecked={sortAscending}
						labelLeft="Z->A"
						labelRight="A->Z"
						title={'Controls the sort direction, either ascending or descending'}
						on:change={() => {
							sortAscending.set(!$sortAscending);
							updateSearchParamWithDebounce.flush({
								sortAscending: JSON.stringify(get(sortAscending))
							});
							updateEvent('toggle sort direction');
						}}
					/>
				</div>
				<button
					title="sort entities now"
					on:click={() => {
						sort(filteredData, `user requested sort`);
						filteredData = filteredData;
						infoToast('sorted!');
					}}
					class="btn-glass"
				>
					<OrderedListOutline class="m-1" />
					Sort
				</button>
				<button
					title="copies all entities as JSON (sorted).&#13;Double click for YAML, single click for JSON"
					on:click={() => {
						debouncedCopyAllConfirm('json');
					}}
					on:dblclick={() => {
						debouncedCopyAllConfirm.flush('yaml');
					}}
					class="btn-glass"
				>
					<FileCopyOutline class="m-1" />
					Copy all
				</button>
				{#if get(preferences.showDeleteAllButton)}
					<button
						title="deletes currently filtered entites"
						class="btn-danger"
						on:click={async () => {
							const conf = await confirm({
								title: 'Delete all entities',
								message: `This will delete all entities currently visible: ${filteredData.length} in total`,
								variant: 'danger',
								confirmText: 'Delete all'
							});
							if (!conf) {
								return;
							}
							const confirmEach = await confirm({
								title: 'Individual confirmation?',
								message: `Confirm each entity's deletion individually (Confirm) or delete all without asking (Cancel)?`,
								variant: 'warning',
								confirmText: 'Confirm each',
								cancelText: 'Delete all'
							});
							const conf2 = await confirm({
								title: 'Last chance',
								message: `Think twice, this is the last chance to cancel! (refresh the page to stop the process)`,
								variant: 'danger',
								confirmText: 'Proceed'
							});
							if (!conf2) {
								return;
							}
							let anyDeleted = false;
							for (const entity of filteredData) {
								if (confirmEach) {
										const confirmEntity = await confirm({
											title: 'Delete entity',
											message: `Confirm deletion of: ${JSON.stringify(
												{ name: entity.name, tags: entity.tags, id: entity.id },
												undefined,
												2
											)}`,
											variant: 'danger',
											confirmText: 'Delete'
										});
									if (!confirmEntity) {
										continue;
									}
								}
								const res = await (await apiService()).deleteRecord(type, entity.id);
								if (res.ok) {
									anyDeleted = true;
									infoToast(
										`deleted ${entity.name ?? ''}(${entity.id}) ${
											filteredData.length - filteredData.indexOf(entity)
										} remaining`
									);
								} else {
									errorToast(`failed deletion of ${entity.name ?? entity.id}`);
									errorToast(res.err ?? 'unknown error occurred');
									break;
								}
							}
							if (anyDeleted) {
								infoToast('deletion successfully finished! the list will be refreshed soon.');
								dispatch('refresh');
							}
						}}
					>
						<TrashBinOutline class="m-1" />
						DELETE ALL
					</button>
				{/if}
				<button
					class="btn-glass"
					title="will update the entire list of entities with a given PATCH body. Sends a PATCH HTTP request"
					on:click={() => {
						if (json.length == 0) {
							json = JSON.stringify(
								filteredData[0].config ? { config: filteredData[0].config ?? {} } : {},
								undefined,
								2
							);
						}
						bulkUpdateOpened = !bulkUpdateOpened;
						if (bulkUpdateOpened) {
							setTextareaHeight();
							triggerHighlight();
						}
					}}
				>
					<CaretDownOutline class="" />
					Bulk update</button
				>
				<div class="flex items-center glass h-10 px-3 rounded-xl">
					<Toggle
						isChecked={loadParentName}
						title={'Loads parent entity name if enabled'}
						on:change={async () => {
							loadParentName.set(!get(loadParentName));
						}}
						labelRight="Load parent"
					/>
				</div>
			</div>
			{#if filteredData.length > paginationSizeUi}
				<div class="info py-4 flex flex-row items-center space-x-2 pl-6 mr-5">
					<button
						disabled={pageNumber == intervalsIterable[0]}
						class={`${paginationClasses} rounded h-7 w-7`}
						on:click={scrollPrevious}
					>
						<ChevronLeftOutline class="size-4" />
					</button>

					{#each intervalsIterable as interval}
						{#if isVisiblePage(interval, pageNumber)}
							<button
								class={`${paginationClasses} h-8 w-8 rounded items-center flex justify-center`}
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
						class={`${paginationClasses} rounded h-7 w-7`}
						on:click={scrollNext}><ChevronRightOutline class="size-4" /></button
					>
					<!-- <p class="text-center text-md">showing {arrayStart + 1} to {arrayEnd}</p> -->
				</div>
			{/if}
		</div>
		{#if bulkUpdateOpened}
			<div class="pt-2 dark:bg-stone-800">
				<div
					class="editor dark:bg-[#1E2021] w-full line-numbers {bulkUpdateOpened
						? 'grid'
						: 'hidden'}"
				>
					<pre class="language-json dark:bg-zinc-900"><code
							class="dark:bg-zinc-900"
							bind:this={editorSyntax}></code></pre>
					<textarea
						bind:this={editorWindow}
						spellcheck="false"
						wrap="hard"
						autocorrect="off"
						autocapitalize="off"
						translate="no"
						class="relative"
						bind:value={json}
						on:input={() => {
							triggerHighlight();
						}}
					></textarea>
				</div>
				<div class="flex flex-row gap-2 py-3 px-4">
					<button
						class="btn-accent"
						title="format and validate JSON"
						on:click={() => formatBulkJson()}
					>Format</button>
					<button
						class="btn-success"
						title="apply bulk update"
						on:click={async () => {
							let ok = await confirm({
								title: 'Bulk update',
								message: `Confirm bulk update of ${filteredData.length} items?\n${JSON.stringify(
									filteredData.map((i) => i.name ?? i.id ?? 'no name/id')
								)}`,
								variant: 'warning',
								confirmText: 'Update'
							});
							if (ok) {
								await applyBulkUpdate();
							} else {
								infoToast('aborted bulk update');
							}
						}}>apply</button
					>
				</div>
			</div>
		{/if}
		<div class="mx-4 rounded-xl border border-[var(--glass-border)] overflow-hidden">
		<table class="w-full">
			<thead class="text-xs uppercase tracking-wider text-[var(--text-tertiary)] h-10 border-b border-[var(--glass-border)] bg-black/[0.02] dark:bg-white/[0.02]">
				<tr>
					{#if get(preferences.enumerateEntities)}
						<th><p class="p-4">No.</p></th>
					{/if}
					<th class="w-0"><p class="p-4"></p></th>
					{#each displayedFields ?? Object.keys($dataRaw[0] ?? {}) as field}
						{#if Object.keys($dataRaw[0] ?? {}).includes(field)}
							<th scope="col" class="p-2">
								{capitalizeFirstLetter(field).replaceAll('_', ' ')}
							</th>
						{/if}
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each filteredData.slice(arrayStart, arrayEnd) as item, index}
					<tr
						class="group border-b border-[var(--glass-border)] transition-colors duration-100
							{index === highlightedRow ? 'bg-[var(--accent)]/[0.08] dark:bg-[var(--accent)]/[0.12]' : 'hover:bg-[var(--accent)]/[0.03] dark:hover:bg-white/[0.04]'}"
						on:auxclick={() => {
							window.open(
								`${base}/entity?type=${type}&id=${item.id}&prefix=${pathPrefix}`,
								'_blank'
							);
						}}
					>
						{#if get(preferences.enumerateEntities)}
							<td class="">
								<p class="text-center font-light pl-3">
									{index + 1 + arrayStart}.
								</p></td
							>
						{/if}
						<td class="p-2 w-0">
							<div class="flex flex-row gap-0.5 opacity-30 group-hover:opacity-100 transition-opacity duration-100">
								<button
									class="btn-icon h-8 w-8"
									title={'copy (single click for JSON, double click for YAML)'}
									on:click|stopPropagation={() => {
										debouncedCopy('json', item);
									}}
									on:dblclick|stopPropagation={() => {
										debouncedCopy.flush('yaml', item);
									}}
								>
									<FileCopyOutline size="sm" />
								</button>
								<a
									href="{base}/entity?type={type}&id={item.id}&prefix={pathPrefix}"
									class="btn-icon h-8 w-8 inline-flex items-center justify-center"
									title="open"
									on:click|stopPropagation|preventDefault={() => goto(`${base}/entity?type=${type}&id=${item.id}&prefix=${pathPrefix}`)}
								>
									<svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/></svg>
								</a>
								<button
									class="btn-icon h-8 w-8 text-[var(--danger)]"
									title="delete"
									on:click|stopPropagation={async () =>
										await deleteEntity(entity?.name ?? '', item.id, item.name ?? item.id)}
								>
									<TrashBinOutline size="sm" />
								</button>
							</div>
						</td>

						{#each displayedFields ?? Object.keys($dataRaw[0] ?? {}) as field}
							{#if Object.keys(item).includes(field)}
								<td class="p-2">
									<div class="flex flex-row items-center justify-between">
										<!-- svelte-ignore a11y-click-events-have-key-events -->
										<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
										<p
											class="mr-2 cursor-pointer select-none overflow-hidden max-h-40 {field.includes(
												'name'
											)
												? 'text-[16px] font-extralight'
												: ''}"
											title={field == 'name'
												? `open ${item.name ?? ''} (${item.id})`
												: `double-click to copy '${field}'\n${JSON.stringify(
														item[field],
														undefined,
														2
													)} `}
											on:click={() => {
												if (field == 'name') {
													goto(`${base}/entity?type=${type}&id=${item.id}&prefix=${pathPrefix}`);
													return;
												}
											}}
											on:dblclick={() => {
												copy(item[field]);
											}}
										>
											{#if typeof item[field] == 'string'}
												{item[field]}
											{:else if typeof item[field] == 'boolean'}
												{#if field === 'enabled'}
													<div on:click|stopPropagation role="button" tabindex="0">
														<Toggle
															isChecked={writable(item[field])}
															title={`click to ${item[field] ? 'disable' : 'enable'} ${
																item.name ?? item.id
															}`}
															on:change={async () => {
																await disable(item.id, !item.enabled);
															}}
														></Toggle>
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
											{:else if item[field] && Object.keys(item[field]).includes('id') && get(preferences.kongEntities).find((i) => i.apiPath == `${field}s`)}
												<!-- svelte-ignore a11y-no-static-element-interactions -->
												<div
													class="px-2 py-1 m-2 dark:shadow-slate-800 shadow rounded"
													title="go to {parentInfoCache[item[field].id] ?? field} ({item[field].id})"
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
																	{#await getParentInfo(field, item[field].id) then value}
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
											{:else if Object.is(item[field], null) || item[field] === undefined}
												-
											{:else if Array.isArray(item[field])}
												<ArrayDisplay
													{item}
													{field}
													on:copy={(e) => {
														copy(e.detail.value);
													}}
												/>
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
	{:else}
		{#if $dataRaw && $dataRaw.length === 0}
			<div class="flex flex-col items-center justify-center py-16 px-4">
				<div class="h-12 w-12 rounded-full bg-[var(--accent)]/10 flex items-center justify-center mb-4">
					<svg class="w-6 h-6 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
						<path stroke-linecap="round" stroke-linejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
					</svg>
				</div>
				<p class="text-base font-semibold text-[var(--text-primary)] mb-1">No {type} found</p>
				<p class="text-sm text-[var(--text-secondary)] mb-4">Add a new one to get started.</p>
				<a href="{base}/add?type={type}" class="btn-accent inline-flex items-center gap-1.5">
					<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
					Add new
				</a>
			</div>
		{:else if searchText}
			<div class="flex flex-col items-center py-12 px-4">
				<p class="text-sm text-[var(--text-tertiary)]">No results matching "{searchText}"</p>
			</div>
		{/if}
	{/if}
</div>

<style lang="postcss">
	button,
	p {
		@apply text-nowrap;
	}

	.editor {
		grid-template-columns: 1fr;
		grid-template-rows: 1fr;
		gap: 0;
	}

	.editor pre,
	.editor textarea {
		grid-area: 1 / 1 / 2 / 2;
	}

	.editor textarea {
		background-color: transparent;
		border: none;
		color: rgba(255, 255, 255, 0.1);
		caret-color: gray;
		overflow: hidden;
		resize: none;
		width: 100%;
	}

	textarea,
	pre {
		padding: 0;
		margin: 0;
	}

	textarea,
	pre,
	code {
		outline: none;
		border: none;
		box-shadow: none;
		font-family: 'JetBrains Mono', monospace;
		font-size: 20px;
		line-height: 30px;
		border-radius: 0;
		white-space: break-spaces;
	}

	textarea,
	pre {
		padding: 10px;
		padding-left: 75px;
	}
</style>
