<script lang="ts">
	import ArrayWrap from './ArrayWrap.svelte';
	export let data: any = {};
	export let json: any = '';
	import { Button } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import TreeWrapper from './treeWrapper.svelte';
	import { apiService } from '$lib/requests';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { writeToClipboard } from '$lib/util';
	import { addToast } from '$lib/stores';
	import { CirclePlusOutline, EditOutline, FileCopyOutline, FloppyDiskAltOutline } from 'flowbite-svelte-icons';
	import { kongEntities } from '$lib/config';
	import type { IKongEntity } from '$lib/types';

	let stateJson = '';

	let isEdited = false;
	export let allowSubentities = true;
	export let id: string;
	export let entity: string;

	let kongEntity: IKongEntity | undefined;

	interface IEntities extends IKongEntity {
		data?: any[];
	}
	let subEntities: IEntities[];

	onMount(async () => {
		stateJson = json;
		data = JSON.parse(json);

		kongEntity = kongEntities.find((i) => i.name == entity);
		subEntities = kongEntities.filter((e) => kongEntity?.subEntities?.includes(e.name)).map(i=>{
			return {
				...i,
				apiPath : `${entity}/${id}/${i.name}`
			}
		});
		for (const ent of subEntities) {
			const res = await (
				await apiService()
			).request<{ data: any[] }>(ent.apiPath);
			if (!res.ok || !res.data) {
				addToast({ message: `failed to load ${ent.name}` });
				continue;
			}
			ent.data = res.data.data as any[];
			subEntities = subEntities;
			// console.log(res);
		}
	});

	async function save() {
		try {
			const res = await (await apiService()).updateRecord(entity, id, JSON.parse(json));

			isEdited = !isEdited;
			isEdited = isEdited;
			data = JSON.parse(json);
			stateJson = json;
		} catch (error: any) {
			const err = error.response.data as any as Error;
			addToast({ message: err.message });
		}
	}
</script>

<div class="pb-10">
	<div class="flex flex-row m-4 h-8">
		<Button
			class="mr-2"
			on:click={() => {
				isEdited = !isEdited;
			}}
		>
			{#if isEdited}
				<FloppyDiskAltOutline class="m-2" />
				save
			{:else}
				<EditOutline class="m-2" />edit
			{/if}
		</Button>
		<Button
			color="alternative"
			class="mr-2"
			on:click={() => {
				writeToClipboard(stateJson);
			}}
		>
			<FileCopyOutline class="m-2" />
			copy</Button
		>
		{#if isEdited}
			{#if stateJson != json}
				<Button on:click={async () => await save()} color="green">save</Button>
			{/if}
		{/if}
	</div>
	{#if data}
		{#if isEdited}
			<textarea class="dark:bg-slate-900 w-full min-h-[70vh]" bind:value={json}></textarea>
		{:else}
			<TreeWrapper {data} />
			{#if subEntities}
				{#each subEntities as subEntity}
				<div class="flex flex-row m-4 h-8 items-center">
					<h2>{subEntity.name}</h2>
					<div class="flex flex-row m-4 h-8">
						<Button
							color="alternative"
							on:click={() => {
								goto(`/add/${subEntity.name}?apiPostPath=${btoa(subEntity.apiPath)}`);
							}}
						>
							<a href="/add/{subEntity.name}?apiPostPath={btoa(subEntity.apiPath)}">
								<div class="flex flex-row items-center">
									<CirclePlusOutline class="m-2" />
									add
								</div>
							</a>
						</Button>
					</div>
				</div>
					{#if subEntity.data && subEntity.data.length > 0}
						<ArrayWrap
							data={subEntity.data}
							displayedFields={subEntity.displayedFields}
							itemPath={subEntity.apiPath}
							pathField="id"
						/>
					{/if}
				{/each}
			{/if}
		{/if}
	{:else}
		<h2 class="text-xl text-center">Loading ...</h2>
	{/if}
</div>
