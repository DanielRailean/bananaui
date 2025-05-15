<script lang="ts">
	import { paginationAwaitBetweenPages } from '$lib/config';
	import type { IKongEntity } from '$lib/types';
	import { CirclePlusOutline, RefreshOutline } from 'flowbite-svelte-icons';
	import { goto } from '$app/navigation';
	import { triggerPageUpdate } from '$lib/stores';
	import { staticConfig } from '$lib/config';
	import ArrayWrap from '$lib/components/ArrayWrap.svelte';
	import { apiService } from '$lib/requests';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { kongEntities } from '$lib/config';
	import { capitalizeFirstLetter, delay } from '$lib/util';
	import { base } from '$app/paths';
	import { DateTime } from 'luxon';
	import { addToast, errorToast, infoToast } from '$lib/toastStore';
	import { Button } from 'flowbite-svelte';
	import Spinner from '$lib/components/Spinner.svelte';

	let data: any | undefined;
	let entity: string;
	let kongEntity: IKongEntity | undefined;
	let isMounted = false;
	let pathPrefix: string = '';

	page.subscribe((val) => {
		load();
	});

	onMount(() => {
		isMounted = true;
		load();
	});
	let loadStart: DateTime | undefined;

	async function load(isRefresh = false) {
		if (!isMounted) {
			return;
		}
		const params = new URLSearchParams(window.location.search);
		loadStart = DateTime.now();
		const oldEntity = entity;
		entity = params.get('type') ?? 'none';
		pathPrefix = params.get('prefix') ?? '';
		let willTriggerUpdate = false;

		if (oldEntity != entity) {
			data = undefined;
			willTriggerUpdate = true;
		}
		try {
			kongEntity = kongEntities.find((i) => i.name == entity);
			if (!kongEntity) {
				return;
			}
			let res = await (await apiService()).findAll<any>(kongEntity.apiPath, {}, pathPrefix);
			if (!res.ok) {
				errorToast(`failed to fetch the ${entity}. ${res.err} (${res.code})`);
				return;
			}
			data = res.data.data;
			var loopStarted = loadStart;
			await delay(paginationAwaitBetweenPages);

			while (res.data.next) {
				res = await (await apiService()).request<any>(res.data.next ?? '', undefined, undefined);
				if (loopStarted != loadStart) {
					break;
				}
				if (res.ok) {
					data = data.concat(res.data.data);
					if (willTriggerUpdate) {
					}
				}
				await delay(paginationAwaitBetweenPages);
			}
			triggerPageUpdate.set(entity + DateTime.now().toMillis());
			if (isRefresh) {
				infoToast('refresh finished!');
			}
		} catch (error: any) {
			console.log(error);
			addToast({ message: `Failed fetching the ${entity}. ${error.message ? error.message : ''}` });
		}
	}
</script>

<svelte:head>
	<title>{capitalizeFirstLetter(entity)} {entity ? '|' : ''} {staticConfig.name}</title>
</svelte:head>

<div class="flex flex-col m-4 mb-3 font-light text-2xl">
	<div class="flex flex-row mb-2 h-10">
		<Button
			class=" flex flex-row mr-2  items-center bg-green-500 dark:bg-green-700"
			on:click={() => {
				load(true);
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
{#if data}
	<ArrayWrap dataRaw={data} type={entity} entity={kongEntity} on:refresh={async () => await load()}
	></ArrayWrap>
{:else}
	<div class="flex flex-row items-center pl-5 pb-4">
		<Spinner text="Loading {entity ?? ''}" />
	</div>
{/if}
