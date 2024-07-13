<script lang="ts">
	import ArrayWrap from './ArrayWrap.svelte';
	export let data: any = {};
	import { Button } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import TreeWrapper from './treeWrapper.svelte';
	import { apiService } from '$lib/requests';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { writeToClipboard } from '$lib/util';
	import { addToast } from '$lib/stores';
	import {
		CirclePlusOutline,
		EditOutline,
		FileCopyOutline,
		FloppyDiskAltOutline,
		PaletteOutline
	} from 'flowbite-svelte-icons';
	import { kongEntities } from '$lib/config';
	import type { IKongEntity } from '$lib/types';

	let stateJson = '';
	let json = '';

	let isEdited = false;
	let id: string;
	let entity: string;

	let kongEntity: IKongEntity | undefined;

	interface IEntities extends IKongEntity {
		data?: any[];
		addPath: string;
	}
	let subEntities: IEntities[];

	$: $page, load();

	async function load() {
		{
			data = undefined;
			entity = $page.url.pathname.split('/')[1];
			id = $page.params.slug;
			const res = await (await apiService()).findRecord(entity, id);
			data = res.data;
			json = JSON.stringify(data, undefined, 2);
			stateJson = json;

			kongEntity = kongEntities.find((i) => i.name == entity);
			subEntities = kongEntities
				.filter((e) => kongEntity?.subEntities?.includes(e.name))
				.map((i) => {
					return {
						...i,
						addPath: `${entity}/${id}/${i.name}`
					};
				});
			for (const ent of subEntities) {
				const res = await (await apiService()).request<{ data: any[] }>(ent.addPath);
				if (!res.ok || !res.data) {
					addToast({ message: `failed to load ${ent.name}` });
					continue;
				}
				ent.data = res.data.data as any[];
				subEntities = subEntities;
			}
		}
	}
	// onMount(async () => {
	// 	await load();
	// });

	function format() {
		let parsed: any | undefined;
		try {
			parsed = JSON.parse(json);
		} catch (err: any) {
			addToast({ message: `Failed to parse JSON. ${err.message}` });
			return;
		}
		json = JSON.stringify(parsed, undefined, 2);
		addToast({ message: `ok`, type: 'info' });
	}
	async function save() {
		const a = confirm('confirm save?');
		if (!a) {
			return;
		}
		format();
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

<div class="mb-4">
	<div class="flex flex-row m-4 h-8">
		<Button
			class="mr-2"
			on:click={() => {
				isEdited = !isEdited;
			}}
		>
			<EditOutline class="m-2" />edit
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
			<Button class="mr-3" on:click={format} color="blue">
				<PaletteOutline class="m-2" />
				format and validate JSON
			</Button>
			{#if stateJson != json}
				<Button class="mr-3" on:click={async () => await save()} color="green">
					<FloppyDiskAltOutline class="m-2" />
					save</Button
				>
			{/if}
		{/if}
	</div>
	{#if data}
		{#if isEdited}
			<textarea class="dark:bg-slate-900 w-full min-h-[70vh]" bind:value={json}></textarea>
		{:else}
			<TreeWrapper {data} rounded={false} />
			{#if subEntities}
				{#each subEntities as subEntity}
					<div class="flex flex-row m-4 h-8 items-center">
						<h2>{subEntity.name}</h2>
						<div class="flex flex-row m-4 h-8">
							<Button
								color="alternative"
								on:click={() => {
									goto(`/add/${subEntity.name}?apiPostPath=${btoa(subEntity.addPath)}`);
								}}
							>
								<a href="/add/{subEntity.name}?apiPostPath={btoa(subEntity.addPath)}">
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
							itemPath={`/${subEntity.apiPath}/id`}
							pathField="id"
							on:refresh={async () => await load()}
						/>
					{/if}
				{/each}
			{/if}
		{/if}
	{:else}
		<h2 class="text-xl text-center">Loading ...</h2>
	{/if}
</div>
