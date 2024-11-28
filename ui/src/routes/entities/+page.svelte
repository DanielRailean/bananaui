<script lang="ts">
	import { paginationAwaitBetweenPages } from '$lib/config';
	import type { IKongEntity } from '$lib/types';
	import { CirclePlusOutline } from 'flowbite-svelte-icons';
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
		const oldEntity = entity
		entity = params.get('type') ?? 'none';
		if(oldEntity != entity) 
		{
			filteredData = undefined
			// infoToast(`Loading ${entity}`)
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
		filteredData = data.filter((item: any) =>
			JSON.stringify(Object.values(item)).toLowerCase().includes(searchText.toLowerCase())
		);
	}
</script>

<svelte:head>
	<title>{staticConfig.name} - {capitalizeFirstLetter(entity)}</title>
</svelte:head>

<div class="flex flex-col mx-4 mt-4">
	<h1 class="text-xl mb-3 ml-1 dark:text-zinc-300">
		{filteredData ? filteredData.length : "Loading"}
		{capitalizeFirstLetter(entity)}
	</h1>
	<div class="flex flex-row mb-2 h-10">
		<Button
			color="alternative"
			class="mr-2"
			on:click={() => {
				load();
				infoToast('refreshed!');
			}}
			>Refresh
		</Button><Button
			class="border-stone-300 mr-2"
			color="alternative"
			on:click={() => {
				goto(`${base}/add?type=${entity}`);
			}}
		>
			<a href="{base}/add?type={entity}">
				<div class="flex flex-row items-center">
					<CirclePlusOutline class="m-2" />
					add
				</div>
			</a>
		</Button>
	</div>
	<div class="w-20 mb-2">
		<input
			class="bg-transparent rounded-lg dark:border-stone-700 border-stone-300"
			type="text"
			bind:value={searchText}
			on:input={() => {
				updateSearchQueryParam();
				search();
			}}
			placeholder="search any field"
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
