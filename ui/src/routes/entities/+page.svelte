<script lang="ts">
	import type { IKongEntity } from '$lib/types';
	import { CirclePlusOutline, RefreshOutline } from 'flowbite-svelte-icons';
	import { goto } from '$app/navigation';
	import { staticConfig } from '$lib/config';
	import ArrayWrap from '$lib/components/ArrayWrap.svelte';
	import Skeleton from '$lib/components/Skeleton.svelte';
	import { apiService, cacheMap, clearCache, type ResWrapped } from '$lib/requests';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { capitalizeFirstLetter, delay } from '$lib/util';
	import { base } from '$app/paths';
	import { DateTime } from 'luxon';
	import { addToast, errorToast, infoToast } from '$lib/toastStore';
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
		const params = get(page).url.searchParams;
		loadStart = DateTime.now();
		entity = params.get('type') ?? 'none';
		pathPrefix = params.get('prefix') ?? '';

		try {
			kongEntity = get(preferences.kongEntities).find((i) => i.name == entity);
			if (!kongEntity) {
				return;
			}
			if (isRefresh) {
				clearCache(kongEntity.apiPath);
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
			if (error.message !== 'Failed to fetch' && error.message !== 'Config not available') {
				addToast({ message: `Failed fetching ${entity}. ${error.message ? error.message : ''}` });
			}
		}
	}
</script>

<svelte:head>
	<title>{capitalizeFirstLetter(entity)} {entity ? '|' : ''} {staticConfig.name}</title>
</svelte:head>

{#if entity}
	<div class="flex items-center justify-between mb-4">
		<h1 class="text-2xl font-semibold">{capitalizeFirstLetter(entity)}</h1>
		<div class="flex items-center gap-2">
			<button
				class="btn-ghost"
				on:click={() => {
					load('user clicked', true);
					infoToast('refresh started!');
				}}
			>
				<RefreshOutline size="sm"></RefreshOutline>
				Refresh
			</button>
			<a
				class="btn-accent"
				href="{base}/add?type={entity}"
				on:click|preventDefault={() => goto(`${base}/add?type=${entity}`)}
			>
				<CirclePlusOutline size="sm" />
				Add new
			</a>
		</div>
	</div>
	<ArrayWrap
		dataRaw={data}
		type={entity}
		entity={kongEntity}
		on:refresh={async () => await load('array wrap requested refresh', true)}
	></ArrayWrap>
{:else}
	<Skeleton rows={8} columns={4} />
{/if}
