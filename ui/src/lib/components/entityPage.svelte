<script lang="ts">
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
	import { EditOutline, FileCopyOutline, FloppyDiskAltOutline } from 'flowbite-svelte-icons';

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
			stateJson = json;
		} catch (error: any) {
			const err = error.response.data as any as Error;
			addToast({ message: err.message });
		}
	}
</script>

<div class="tree">
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
		{/if}
	{:else}
		<h2 class="text-xl text-center">Loading ...</h2>
	{/if}
</div>
