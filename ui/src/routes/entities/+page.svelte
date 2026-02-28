<script lang="ts">
	import type { IKongEntity } from '$lib/types';
	import { CirclePlusOutline, RefreshOutline } from 'flowbite-svelte-icons';
	import { goto } from '$app/navigation';
	import { staticConfig } from '$lib/config';
	import ArrayWrap from '$lib/components/ArrayWrap.svelte';
	import { apiService, cacheMap, type ResWrapped } from '$lib/requests';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { kongEntities } from '$lib/config';
	import { capitalizeFirstLetter, delay } from '$lib/util';
	import { base } from '$app/paths';
	import { DateTime } from 'luxon';
	import { addToast, errorToast, infoToast } from '$lib/toastStore';
	import { Button } from 'flowbite-svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import { writable, get, type Writable } from 'svelte/store';
	import { preferences } from '$lib/stores';

	let data: Writable<any[]> = writable([]);
	let entity: string;
	let kongEntity: IKongEntity | undefined;
	let isMounted = false;
	let pathPrefix: string = '';

	page.subscribe((val) => {
		if (!isMounted) {
			return;
		}
		load('page changed');
	});

	onMount(() => {
		isMounted = true;
		load('on mount');
	});
	let loadStart: DateTime | undefined;

	async function load(caller = '', isRefresh = false) {
		console.log(`load called by '${caller}'`);
		if (!isMounted) {
			return;
		}
		const params = new URLSearchParams(window.location.search);
		loadStart = DateTime.now();
		entity = params.get('type') ?? 'none';
		pathPrefix = params.get('prefix') ?? '';

		try {
			kongEntity = kongEntities.find((i) => i.name == entity);
			if (!kongEntity) {
				return;
			}
			let res = await (
				await apiService()
			).findAll<any>(kongEntity.apiPath, {}, pathPrefix, isRefresh);
			if (!res.ok) {
				errorToast(`failed to fetch the ${entity}. ${res.err} (${res.code})`);
				return;
			}
			data.set(res.data.data);
			var loopStarted = loadStart;
			await delay(get(preferences.paginationRequestsDelayMs));

			while (res.data.next) {
				res = await (await apiService()).request<any>(res.data.next ?? '', undefined, undefined);
				if (loopStarted != loadStart) {
					break;
				}
				if (res.ok) {
					data.set(get(data).concat(res.data.data));
				}
				await delay(get(preferences.paginationRequestsDelayMs));
			}
			// dataplanes don't have a page of their own.
			// populating the cache to fake as if the request went through
			if (kongEntity && kongEntity.apiPath === 'clustering/data-planes') {
				for (const dp of $data) {
					const res: ResWrapped<any, any> = {
						code: 200,
						ok: true,
						data: dp
					};
					cacheMap[`/dataplanes/${dp.id}`] = res;
				}
			}
			if (isRefresh) {
				infoToast('refresh finished!');
			}
		} catch (error: any) {
			console.error(error);
			addToast({ message: `Failed fetching ${entity}. ${error.message ? error.message : ''}` });
		}
	}
</script>

<svelte:head>
	<title>{capitalizeFirstLetter(entity)} {entity ? '|' : ''} {staticConfig.name}</title>
</svelte:head>

{#if entity}
	<div class="flex flex-col m-4 mb-3 font-light text-2xl">
		<div class="flex flex-row mb-2 h-10">
			<Button
				class=" flex flex-row mr-2  items-center bg-green-500 dark:bg-green-700"
				on:click={() => {
					load('user clicked', true);
					infoToast('refresh started!');
				}}
			>
				<RefreshOutline class="mr-2"></RefreshOutline>
				Refresh
			</Button>
			<Button
				class="flex flex-row mr-2 bg-blue-500 dark:bg-blue-600"
				on:click={() => {
					goto(`${base}/add?type=${entity}`);
				}}
			>
				<a href="{base}/add?type={entity}">
					<div class="flex flex-row items-center space-x-1">
						<CirclePlusOutline class="mr-2" />
						Add
					</div>
				</a>
			</Button>
		</div>
	</div>
	<ArrayWrap
		dataRaw={data}
		type={entity}
		entity={kongEntity}
		on:refresh={async () => await load('array wrap requested refresh', true)}
	></ArrayWrap>
{:else}
	<div class="flex flex-row items-center p-5 h-full w-full">
		<Spinner text={entity ? `loading ${entity}` : ''} />
	</div>
{/if}
