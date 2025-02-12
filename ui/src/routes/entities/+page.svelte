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
	import { addToast, infoToast } from '$lib/toastStore';

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

	async function load(isRefresh = false) {
		if (!isMounted) {
			return;
		}
		const params = new URLSearchParams(window.location.search);
		loadStart = DateTime.now();
		const oldEntity = entity;
		entity = params.get('type') ?? 'none';
		let willTriggerUpdate = false;

		if (oldEntity != entity) {
			data = undefined
			willTriggerUpdate = true;
		}
		try {
			kongEntity = kongEntities.find((i) => i.name == entity);
			if (!kongEntity) {
				return;
			}
			let res = await (await apiService()).findAll<any>(kongEntity.apiPath, {});
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
						triggerPageUpdate.set(entity + DateTime.now().toUnixInteger());
					}
				}
				await delay(paginationAwaitBetweenPages);
			}
			triggerPageUpdate.set(entity + DateTime.now().toUnixInteger());
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
	<title>{capitalizeFirstLetter(entity)} | {staticConfig.name}</title>
</svelte:head>

<div class="flex flex-col m-4 mb-3 font-light text-2xl">
	<div class="flex flex-row mb-2 h-10">
		<button
			color="alternative"
			class=" flex flex-row mr-2 text-emerald-600 items-center"
			on:click={() => {
				load(true);
				infoToast('refresh started!');
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
					<CirclePlusOutline class="mr-[2px]" />
					Add
				</div>
			</a>
		</button>
	</div>
</div>
{#if data}
	<ArrayWrap dataRaw={data} type={entity} entity={kongEntity} on:refresh={async () => await load()}
	></ArrayWrap>
{:else}
	<p class="pl-5 pb-4 text-xl font-light">Loading {entity ?? ''}</p>
{/if}
