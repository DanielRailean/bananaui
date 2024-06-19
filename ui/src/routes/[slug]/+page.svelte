<script lang="ts">
	import { staticConfig } from '$lib/config';
	import ArrayWrap from './../../ArrayWrap.svelte';
	import type { GetAllServices } from '$lib/responseTypes.ts';
	import { apiService } from '$lib/requests';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { kongEntities } from '$lib/config';

	let info: GetAllServices | undefined;
	let entity = $page.params.slug;

	page.subscribe((val) => {
		entity = val.params.slug;
		if (kongEntities.find((item) => item.name == entity)) {
			info = undefined;
			load();
		}
	});

	async function load() {
		try {
			const kongEntity = kongEntities.find((i) => i.name == entity);
			if (!kongEntity) {
				return;
			}
			const res = await apiService.findAll(kongEntity.apiPath, {});
			info = res.data as GetAllServices;
			// console.log(entity)
		} catch (error) {
			// console.log(error);
		}
	}
	onMount(() => {
		load();
	});
</script>

<svelte:head>
	<title>{staticConfig.name} - {entity}</title>
</svelte:head>

{#if info && info.data && info.data.length > 0}
	<ArrayWrap
		displayedFields={kongEntities.find((item) => item.name == entity)?.displayedFields}
		data={info.data}
		pathField="id"
		itemPath="/{entity}/id"
	></ArrayWrap>
{:else if info && info.data && info.data.length == 0}
	<div class="flex h-[100vh] w-full justify-center items-center">
		<h2 class="text-3xl text-center">{entity} list empty</h2>
	</div>
{/if}
<div class="text-column"></div>
