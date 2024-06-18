<script lang="ts">
	import ArrayWrap from './../../ArrayWrap.svelte';
	import type { GetAllServices } from '$lib/responseTypes.ts';
	import { apiService } from '$lib/requests';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { entityFields } from '$lib/entities';

	let info: GetAllServices;
	let entity = $page.params.slug;

	page.subscribe((val) => {
		entity = val.params.slug;
		if(Object.keys(entityFields).includes(entity))
		{
			load();
		}
	});

	async function load() {
		try {
			const res = await apiService.findAll(entity, {});
			info = res.data as GetAllServices;
			// console.log(entity)
		} catch (error) {
			alert(error);
		}
	}
	onMount(() => {
		load();
	});
</script>

{#if info && info.data && info.data.length > 0}
	<ArrayWrap displayedFields={entityFields[entity]} data={info.data} pathField="id" itemPath="/{entity}/id"
	></ArrayWrap>
{:else if info && info.data && info.data.length == 0}
	<h2>{entity} list empty!</h2>
{/if}
<div class="text-column"></div>
