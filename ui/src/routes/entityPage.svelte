<script lang="ts">
	export let data: any = {};
	export let json: any = '';
	import { Button } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import TreeWrapper from './treeWrapper.svelte';
	import { apiService } from '$lib/requests';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	let stateJson = '';

	let isEdited = false;

	export let id: string;
	export let entity: string;

	onMount(() => {
		stateJson = json;
		data = JSON.parse(json);
	});

	async function save() {
		try {
			const res = await apiService.updateRecord(entity, id, JSON.parse(json));

			isEdited = !isEdited;
			isEdited = isEdited;
			data = JSON.parse(json);
		} catch (error: any) {
			const err = error.response.data as any as Error;
			console.log(err.message);
		}
	}
</script>

<div class="tree">
	<div class="flex flex-row my-4">
		<Button
			class="mr-5"
			on:click={() => {
				isEdited = !isEdited;
			}}
			color="alternative">{isEdited ? 'cancel' : 'edit'}</Button
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
		{/if}
	{:else}
		<h2 class="text-xl text-center">Loading ...</h2>
	{/if}
</div>