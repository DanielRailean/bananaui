<script lang="ts">
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

	let data: any | undefined;
	let entity: string | undefined;

	$: $page, load()

	async function load() {
		data = undefined
		entity = $page.params.slug;
		try {
			const kongEntity = kongEntities.find((i) => i.name == entity);
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
	<title>{staticConfig.name} - {entity}</title>
</svelte:head>

<div class="flex flex-row m-4 h-8">
	<Button
		color="alternative"
		on:click={() => {
			goto(`/add/${entity}`);
		}}
	>
		<a href="/add/{entity}">
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
		pathField="id"
		itemPath="/{entity}/id"
		on:refresh={async () => await load()}
	></ArrayWrap>
{:else}
	<div class="flex h-[100vh] w-full justify-center items-center">
		<h2 class="text-3xl text-center">{entity} list empty</h2>
	</div>
{/if}
<div class="text-column"></div>
