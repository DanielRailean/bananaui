<script lang="ts">
	import { paginationAwaitBetweenPages } from '$lib/config';
	import type { IKongEntity } from '$lib/types';
	import { CirclePlusOutline, RefreshOutline } from 'flowbite-svelte-icons';
	import { goto } from '$app/navigation';
	import { Button } from 'flowbite-svelte';
	import { addToast, triggerSort, infoToast } from '$lib/stores';
	import { staticConfig } from '$lib/config';
	import ArrayWrap from '$lib/components/ArrayWrap.svelte';
	import { apiService } from '$lib/requests';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { kongEntities } from '$lib/config';
	import { capitalizeFirstLetter, delay } from '$lib/util';
	import { base } from '$app/paths';
	import { DateTime } from 'luxon';

	let data: any | undefined;
	let entity: string;
	let kongEntity: IKongEntity | undefined;
	let isMounted = false;

	$: $page, load();

	onMount(() => {
		isMounted = true;
		load();
	});
	let loadStart: DateTime | undefined;

	let searchText = '';
	let filteredData: any[] | undefined;

	async function load() {
		if (!isMounted) {
			return;
		}
		data = undefined;
		const params = new URLSearchParams(window.location.search);
		loadStart = DateTime.now();
		const oldEntity = entity;
		entity = params.get('type') ?? 'none';
		if (oldEntity != entity) {
			filteredData = undefined;
		}
		searchText = params.get('search') ?? '';
		try {
			kongEntity = kongEntities.find((i) => i.name == entity);
			if (!kongEntity) {
				return;
			}
			let res = await (await apiService()).findAll<any>(kongEntity.apiPath, {});
			data = res.data.data;
			search();
			var loopStarted = loadStart;
			await delay(paginationAwaitBetweenPages);

			while (res.data.next) {
				res = await (await apiService()).request<any>(res.data.next ?? '', undefined, undefined);
				if (loopStarted != loadStart) {
					break;
				}
				if (res.ok) {
					data = data.concat(res.data.data);
					search();
					triggerSort.set(DateTime.now());
				}
				await delay(paginationAwaitBetweenPages);
			}
		} catch (error: any) {
			console.log(error);
			addToast({ message: `Failed fetching the ${entity}. ${error.message ? error.message : ''}` });
		}
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
			filteredData = data;
		}
		const many = searchText.split(/\s*&&\s*/);
		if (many.length > 1) {
			filteredData = data.filter((item: any) => {
				for (const condition of many) {
					const conditionPassed = JSON.stringify(Object.values(item))
						.toLowerCase()
						.includes(condition.toLowerCase());
					if (!conditionPassed) return false;
				}
				return true;
			});
		} else {
			filteredData = data.filter((item: any) =>
				JSON.stringify(Object.values(item)).toLowerCase().includes(searchText.toLowerCase())
			);
		}
		triggerSort.set(DateTime.now());
	}
</script>

<svelte:head>
	<title>{staticConfig.name} - {capitalizeFirstLetter(entity)}</title>
</svelte:head>

<div class="flex flex-col mx-4 mt-4">
	<h1 class="text-xl mb-3 ml-1 dark:text-zinc-300">
		{filteredData ? filteredData.length : 'Loading'}
		{capitalizeFirstLetter(entity)}
	</h1>
	<div class="flex flex-row mb-2 h-10">
		<button
			color="alternative"
			class=" flex flex-row mr-2 text-emerald-600 items-center"
			on:click={() => {
				load();
				infoToast('refreshed!');
			}}
		>
			<RefreshOutline></RefreshOutline>
			Refresh
		</button>
		<button
			class="flex flex-row mr-2 text-blue-700 items-center"
			color="alternative"
			on:click={() => {
				goto(`${base}/add?type=${entity}`);
			}}
		>
			<a href="{base}/add?type={entity}">
				<div class="flex flex-row items-center space-x-1">
					<CirclePlusOutline class="mr-1" />
					Add
				</div>
			</a>
		</button>
	</div>
	<div class="w-20 mb-2">
		<input
			class="bg-transparent rounded-lg border-none outline-none focus:[box-shadow:none] ml-[-8px]"
			type="text"
			disabled={!(data && data.length > 0)}
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
</div>
{#if filteredData && filteredData.length > 0}
	<ArrayWrap
		data={filteredData}
		type={entity}
		entity={kongEntity}
		on:refresh={async () => await load()}
	></ArrayWrap>
{/if}
