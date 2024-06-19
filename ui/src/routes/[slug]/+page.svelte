<script lang="ts">
	import { staticConfig } from '$lib/config';
	import ArrayWrap from './../../ArrayWrap.svelte';
	import type { GetAllServices } from '$lib/responseTypes.ts';
	import { apiService } from '$lib/requests';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { entityFields } from '$lib/entities';

	let info: GetAllServices | undefined;
	let entity = $page.params.slug;

	page.subscribe((val) => {
		entity = val.params.slug;
		if (Object.keys(entityFields).includes(entity)) {
			info = undefined;
			load();
		}
	});

	async function load() {
		try {
			const res = await apiService.findAll(entity, {});
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
		displayedFields={entityFields[entity]}
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
