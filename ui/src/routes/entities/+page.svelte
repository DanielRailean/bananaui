<script lang="ts">
	import type { IKongEntity } from '$lib/types.ts';
	import { CirclePlusOutline } from 'flowbite-svelte-icons';
	import { goto } from '$app/navigation';
	import { Button } from 'flowbite-svelte';
	import { addToast } from '$lib/stores';
	import { staticConfig } from '$lib/config';
	import ArrayWrap from '../../lib/components/ArrayWrap.svelte';
	import { apiService } from '$lib/requests';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { kongEntities } from '$lib/config';
	import { capitalizeFirstLetter } from '$lib/util';

	let data: any | undefined;
	let entity: string;
	let kongEntity: IKongEntity | undefined
	let isMounted = false

	$: $page, load();


	onMount(()=>{
		isMounted = true
		load()
	})

	async function load() {
		if(!isMounted)
		{
			return
		}
		data = undefined;
		entity = new URLSearchParams(window.location.search).get('type') ?? "none";
		try {
			kongEntity = kongEntities.find((i) => i.name == entity);
			if (!kongEntity) {
				return;
			}
			const res = await (await apiService()).findAll<any>(kongEntity.apiPath, {});
			data = res.data.data;
			// console.log(entity)
		} catch (error: any) {
			console.log(error);
			addToast({ message: `Failed fetching the ${entity}. ${error.message ? error.message : ''}` });
		}
	}
</script>

<svelte:head>
	<title>{staticConfig.name} - {capitalizeFirstLetter(entity)}</title>
</svelte:head>

<div class="flex flex-col mx-4 mt-4">
	<h1 class="text-xl mb-3 ml-1 dark:text-zinc-300">
		{data ? data.length : 0}
		{capitalizeFirstLetter(entity)}
	</h1>
	<Button
		class="h-8 w-20 border-slate-300"
		color="alternative"
		on:click={() => {
			goto(`/add?type=${entity}`);
		}}
	>
		<a href="/add?type={entity}">
			<div class="flex flex-row items-center">
				<CirclePlusOutline class="m-2" />
				add
			</div>
		</a>
	</Button>
</div>
{#if data && data.length > 0}
	<ArrayWrap
		displayedFields={kongEntities.find((item) => item.name == entity)?.displayedFields}
		{data}
		type={entity}
		entity={kongEntity}
		on:refresh={async () => await load()}
	></ArrayWrap>
{:else}
	<div class="flex w-full justify-center items-center">
		<h2 class="text-xl text-center mb-10">No entries</h2>
	</div>
{/if}