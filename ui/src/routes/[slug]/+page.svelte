<script lang="ts">
	import ArrayWrap from './../../ArrayWrap.svelte';
	import type { GetAllServices } from '$lib/responseTypes.ts';
	import { apiService } from '$lib/requests';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { entityFields } from '$lib/entities';
	import { goto } from '$app/navigation';

	let info: GetAllServices;
	let entity = $page.params.slug;

	page.subscribe((val) => {
		entity = val.params.slug;
		if (Object.keys(entityFields).includes(entity)) {
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

{#if info && info.data && info.data.length > 0}
	<ArrayWrap
		displayedFields={entityFields[entity]}
		data={info.data}
		pathField="id"
		itemPath="/{entity}/id"
	></ArrayWrap>
{:else if info && info.data && info.data.length == 0}
	<div class="flex min-h-[20vh] w-full justify-center items-center">
		<h2 class="text-3xl text-center">{entity.toUpperCase()} list empty!</h2>
	</div>
{/if}
<div class="text-column"></div>
