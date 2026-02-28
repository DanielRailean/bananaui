<script lang="ts">
	import Link from './Link.svelte';
	import { capitalizeFirstLetter, debouncedCall, delay, writeToClipboard } from '$lib/util';
	import { goto } from '$app/navigation';
	import { onDestroy, onMount } from 'svelte';
	import { DateTime } from 'luxon';
	import { CaretDownOutline, FileCopyOutline, TrashBinOutline } from 'flowbite-svelte-icons';
	import { dateFields, kongEntities, yamlDumpOptions } from '$lib/config';
	import { apiService, clearCache } from '$lib/requests';
	import { addToast, confirmToast, errorToast, infoToast } from '$lib/toastStore';
	import { createEventDispatcher } from 'svelte';
	import type { IKongEntity, ITooggleableEntityMaybe } from '$lib/types';
	import { base } from '$app/paths';
	import Toggle from './Toggle.svelte';
	import { get, writable, type Writable } from 'svelte/store';
	import { ChevronLeftOutline, ChevronRightOutline } from 'flowbite-svelte-icons';
	import { preferences } from '$lib/stores';
	import { Button } from 'flowbite-svelte';
	import { dump } from 'js-yaml';

	let loadParentName = preferences?.loadParentInfo;
	let useNewSearch = preferences?.useNewSearch;
	const dispatch = createEventDispatcher();

	export let dataRaw: Writable<ITooggleableEntityMaybe[]>;
	export let type: string;
	export let entity: IKongEntity | undefined = undefined;
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
	let debouncedCopyAllConfirm = debouncedCall((format: 'yaml' | 'json') => {
		const conf = confirm(
			`confirm ${format.toUpperCase()} copy of ${filteredData.length} entities?`
		);
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
		console.log(`page update triggered by data change items no: ${v.length}`);
		updateEvent('trigger update');
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
		sortByField = params.get('sortBy') ?? sortByField;
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
	// {
	// [and inside here]
	// []
	// or between those
	// []
	// }

	// ex: (hello && test) || (no || test && no) && yes.len != 2
	// becomes [["hello", "test"], [["no"], ["test", "no"], [{"yes": -2}]]]
	// loop over initial array, any object satisfying 1st level arrays are allowed
	// if array of array encountered, any object must satisfy all conditions in the subarray
	function itemPassesLength(obj: any, len: { [key: string]: number }): boolean {
		if (!obj) {
			return false;
		}
		for (const [key, val] of Object.entries(len)) {
			if (!obj[key] || !Array.isArray(obj[key])) {
				return false;
			}
			var arrayValue = obj[key];
			if (val < 0) {
				if (arrayValue.length === val * -1) {
					return false;
				}
			} else {
				if (arrayValue.length != val) {
					return false;
				}
			}
		}
		return true;
	}
	// const objWithArr = {"hello": ["2", 2]}
	// console.log(itemPassesLength(objWithArr, {"hello": -2}))
	// console.log(itemPassesLength(objWithArr, {"hello": -3}))
	// console.log(itemPassesLength(objWithArr, {"hello": 2}))
	// console.log(itemPassesLength(objWithArr, {"hell": 2}))

	function itemPassesOrValidations(obj: any, validation: any[]): boolean {
		const json = JSON.stringify(obj).toLowerCase();
		for (const condition of validation) {
			if (typeof condition === 'string') {
				const conditionStr = `${condition}`.toLowerCase();
				if (json.includes(conditionStr)) {
					return true;
				}
				continue;
			}
			if (Object.keys(condition).length > 0 && !Array.isArray(condition)) {
				if (itemPassesLength(obj, condition)) {
					return true;
				}
				continue;
			}
			if (Array.isArray(condition)) {
				let res = itemPassesOrValidations(obj, condition);
				if (res) {
					return true;
				}
				continue;
			}
		}
		return false;
	}

	// const objWithArr2 = { hello: ['2', 2], yes: 'no', nr: 3 };
	// console.log(itemPassesValidation(objWithArr2, [{ hello: 1 }, {hello: -3}, ['noa', '31'], "helloo"]));

	const lenNotEqOp = '.len != ';
	const lenEqOp = '.len == ';
	function getLogicalGroups(input: string) {
		if (input.trim().length == 0) {
			return [];
		}
		const inputCommaSplit = input.split(',');
		let groups = [];
		for (let anyConditions of inputCommaSplit) {
			// console.log(anyConditions.trim());
			let andGroups = [];
			const booleanAndSearch = anyConditions.split(/\s*&&\s*/);
			for (const andCondition of booleanAndSearch) {
				let orGroups = [];
				const boolOrSearch = andCondition.split(/\s*\|\|\s*/);
				for (const orCondition of boolOrSearch) {
					if (orCondition.includes(lenNotEqOp) || orCondition.includes(lenEqOp)) {
						const lenNotEq: any = {};
						let split = orCondition.split(lenNotEqOp);
						let sign = -1;
						if (split.length == 1) {
							split = orCondition.split(lenEqOp);
							sign = 1;
						}
						lenNotEq[split[0].trim()] = +split[1].trim() * sign;
						orGroups.push(lenNotEq);
						continue;
					}
					orGroups.push(orCondition.trim());
				}
				andGroups.push(orGroups);
			}
			groups.push(andGroups);
		}
		return groups;
	}
	function doSearch(input: string, arr: any[]) {
		if (!$dataRaw) {
			return;
		}
		const orAndOr = getLogicalGroups(input);
		console.log(JSON.stringify(orAndOr));
		if (orAndOr.length == 0) {
			return arr;
		}
		let result: ITooggleableEntityMaybe[] = [];
		for (const orGroup of orAndOr) {
			let orPassed: ITooggleableEntityMaybe[] | undefined = undefined;
			for (const orAndGroup of orGroup) {
				let temp = arr.filter((item: any) => itemPassesOrValidations(item, orAndGroup));
				// console.log(JSON.stringify(orGroup, undefined, 2));
				if (!orPassed) {
					orPassed = temp;
				}
				orPassed = orPassed!.filter((item) => temp.find((i) => i.id === item.id) != undefined);
			}
			result = [...result, ...(orPassed ?? [])];
		}
		return result.filter(onlyUnique);
	}
	function onlyUnique(value: any, index: number, array: any[]) {
		return array.indexOf(value) === index;
	}

	// getLogicalGroups('hello && test, no || test.len == 2 && no, yes.len != 2');
	function search() {
		if (searchText.length == 0) {
			// we don't always sort on update event,
			// because it could be searched, so we must sort when we know we're no longer searching
			sort(get(dataRaw), `search ${type}`);
			filteredData = $dataRaw.map((i: any): FilteredEntity => {
				if (i.enabled != undefined) {
					i.enabledWritable = writable(i.enabled);
				}
				return i as FilteredEntity;
			});
		}
		if (get(useNewSearch)) {
			filteredData = doSearch(searchText, $dataRaw) ?? [];
		} else {
			const booleanAndSearch = searchText.split(/\s*&&\s*/);
			filteredData = $dataRaw.filter((item: any) => {
				for (let condition of booleanAndSearch) {
					const len = condition.split('.len == ');
					if (len && len.length > 1 && Number.isInteger(+len[1]) && Array.isArray(item[len[0]])) {
						const passed = item[len[0]].length === +len[1];
						if (!passed) return false;
						continue;
					}

					const not_len = condition.split('.len != ');
					if (
						not_len &&
						not_len.length > 1 &&
						Number.isInteger(+not_len[1]) &&
						Array.isArray(item[not_len[0]])
					) {
						const passed = item[not_len[0]].length != +not_len[1];
						if (!passed) return false;
						continue;
					}
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
		}
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

	let editorWindow: HTMLTextAreaElement;
	let editorSyntax: HTMLElement;
	let json = '';

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

	async function applyBulkUpdate() {
		bulkUpdateOpened = false;
		const updateBody = JSON.parse(json);
		for (const element of filteredData) {
			console.log(updateBody);
			console.log(element);

			const res = await (await apiService()).updateRecord(type, element.id, updateBody);
			console.log(res);
			if (!res.ok) {
				errorToast(res.err ?? `failed to update ${element.id}`);
			} else {
				infoToast(`ok update ${element.id} with ${JSON.stringify(updateBody)}`);
			}
		}
		infoToast(`bulk update finished`);
		clearCache(type);
		dispatch('refresh');
	}
	let bulkUpdateOpened = false;

	onDestroy(() => {
		updateSearchParamWithDebounce.cancel();
		debouncedCopy.cancel();
		debouncedCopyAllConfirm.cancel();
	});
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
				disabled={!($dataRaw && $dataRaw.length > 0)}
				bind:value={searchText}
				on:emptied={() => {
					console.log('is empty');
				}}
				on:input={() => {
					console.log(searchText);
					updateSearchParamWithDebounce({ search: searchText });
					search();
				}}
				title="Searches the JSON representation for the given text. &#013; &#013;Logical 'AND' is supported using the '&&' operator.&#013;Ex: 'host && /path'&#013&#013;For arrays, the .len syntax is supported, to assert it's length.&#013;Ex: tags.len == 2; tags.len != 3"
				placeholder="search (hover for more info)"
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
				bind:value={sortByField}
				on:change={() => {
					updateSearchParamWithDebounce({ sortBy: sortByField });
					updateEvent('select sort by');
				}}
				class="dark:bg-stone-700 shadow shadow-slate-600 h-6 p-0 max-w-36 pl-2 border-none rounded focus:border-none focus:[box-shadow:none]"
			>
				{#each Object.keys($dataRaw[0] ?? {}) as key}
					<option value={key} selected={key == sortByField}>{key}</option>
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
					updateSearchParamWithDebounce({ sortAscending: JSON.stringify(get(sortAscending)) });
					updateEvent('toggle sort direction');
				}}
			/>
		</div>
		<div class="flex flex-row mt-4">
			<button
				title="copies all entities as JSON (sorted).&#13;Double click for YAML, single click for JSON"
				on:click={() => {
					debouncedCopyAllConfirm('json');
				}}
				on:dblclick={() => {
					debouncedCopyAllConfirm.flush('yaml');
				}}
				class="flex flex-row items-center dark:bg-stone-700 bg-stone-100 rounded p-1 pr-2 m-1"
			>
				<FileCopyOutline class="m-1" />
				COPY ALL
			</button>
			{#if get(preferences.showDeleteAllButton)}
				<button
					title="deletes currently filtered entites"
					class="flex flex-row items-center dark:bg-rose-900 bg-stone-100 rounded p-1 pr-2 m-1"
					on:click={async () => {
						const conf = confirm(
							`this will delete all entities currently visible: ${filteredData.length} in total`
						);
						if (!conf) {
							return;
						}
						const confirmEach = confirm(
							`delete without confirmation on each entity (Cancel)\nor confirm each entity's deletion individually (OK) ?`
						);
						const conf2 = confirm(
							`think twice, this is the last chance to cancel!\n(refresh the page to stop the process)`
						);
						if (!conf2) {
							return;
						}
						let anyDeleted = false;
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
								anyDeleted = true;
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
						if (anyDeleted) {
							infoToast('deletion successfully finished! the page will be refreshed soon.');
							dispatch('refresh');
						}
					}}
				>
					<TrashBinOutline class="m-1" />
					DELETE ALL
				</button>
			{/if}
			<Button
				color="alternative"
				class="h-10 m-1"
				title="bulk-update"
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
						triggerHighlight();
					}
				}}
			>
				<CaretDownOutline class="" />
				bulk-update</Button
			>
		</div>
		{#if bulkUpdateOpened}
			<div>
				<Button
					color="alternative"
					class="h-10 m-1"
					title="bulk-update"
					on:click={async () => {
						let ok = confirm(
							`confirm bulk update of ${filteredData.length} items ?\n${JSON.stringify(
								filteredData.map((i) => i.name ?? i.id ?? 'no name/id')
							)}`
						);
						if (ok) {
							await applyBulkUpdate();
						} else {
							infoToast('aborted bulk-update');
						}
					}}>apply</Button
				>
			</div>
			<div
				class="editor dark:bg-[#1E2021] w-full min-h-[80vh] line-numbers {bulkUpdateOpened
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
			<!-- content here -->
		{/if}
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
					{#each displayedFields ?? Object.keys($dataRaw[0] ?? {}) as field}
						{#if Object.keys($dataRaw[0] ?? {}).includes(field)}
							<th scope="col" class="pl-4"> {field} </th>
						{/if}
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each filteredData.slice(arrayStart, arrayEnd) as item, index}
					<tr
						class="dark:hover:bg-stone-900 hover:bg-blue-300 border dark:border-stone-800 rounded"
						on:auxclick={() => {
							window.open(
								`${base}/entity?type=${type}&id=${item.id}&prefix=${pathPrefix}`,
								'_blank'
							);
						}}
					>
						<td class="">
							<p class="text-center font-light pl-3">
								{index + 1 + arrayStart}.
							</p></td
						>
						<td class="p-2">
							<div class=" space-x-1 flex flex-row">
								<button
									class="h-8"
									title={'copy (single click for JSON, double click for YAML) ' +
										JSON.stringify(item, undefined, 2)}
									on:click={() => {
										debouncedCopy('json', item);
									}}
									on:dblclick={() => {
										debouncedCopy.flush('yaml', item);
									}}
								>
									<div
										class="flex flex-row items-center rounded hover:outline outline-1 hover:outline-stone-700"
									>
										<FileCopyOutline class="m-1" size="lg" />
									</div>
								</button>
								<Link href="{base}/entity?type={type}&id={item.id}&prefix={pathPrefix}" />
								<button
									class="h-8"
									title="delete"
									on:click={async () =>
										await deleteEntity(entity?.name ?? '', item.id, item.name ?? item.id)}
								>
									<div class="text-rose-500">
										<div
											class="flex flex-row items-center rounded hover:outline outline-1 hover:outline-stone-700"
										>
											<TrashBinOutline class="m-1" size="lg" />
										</div>
									</div>
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
														<label
															class="inline-flex items-center cursor-pointer"
															title="enable or disable"
														>
															<input
																type="checkbox"
																bind:checked={item.enabled}
																on:change|stopPropagation|preventDefault={async () => {
																	let ok = confirm('confirm action');
																	if (ok) {
																		item.enabled = !item.enabled;
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
																class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:dark:bg-stone-900 after:dark:border-none after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-800"
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
															<p
																class="dark:text-blue-500 text-blue-700 px-1 truncate max-w-[360px]"
															>
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
											{:else if Array.isArray(item[field])}
												<div
													class="flex flex-row flex-wrap justify-start max-w-[650px] {field ==
													'methods'
														? `max-w-[200px]`
														: 'max-w-[650px]'}"
												>
													{#each item[field] as row, index}
														<p
															class="text-xs cursor-pointer select-none p-1 border dark:border-stone-600 m-1 hover:dark:bg-stone-800 hover:bg-slate-50 {field ==
															'methods'
																? `http-method method-${item[field][index].toLowerCase()}`
																: ''}"
															title="double-click to copy '{item[field][index]}'"
															on:dblclick={() => {
																copy(item[field][index]);
															}}
														>
															{row}
														</p>
													{/each}
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
