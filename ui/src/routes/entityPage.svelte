<script lang="ts">
	export let data: any = {};
	export let json: any = "";
	import { Button } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import TreeWrapper from './treeWrapper.svelte';
	import { apiService } from '$lib/requests';

	let stateJson = '';

	let isEdited = false;

	export let id: string
	export let entity: string

	onMount(() => {
		stateJson = json;
		data = JSON.parse(json);
	});

	async function save() {
		try {
			const res = await apiService.updateRecord(entity, id, JSON.parse(json))
			
			isEdited = !isEdited
			isEdited = isEdited
		} catch (error: any) {
			const err = error.response.data as any as Error
			alert(err.message)
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
				<Button on:click={async ()=>await save()} color="green">save</Button>
			{/if}
		{/if}
	</div>
	{#if data}
		{#if isEdited}
			<textarea class="dark:bg-slate-900 w-full min-h-[70vh]" bind:value={json}></textarea>
		{:else}
			<TreeWrapper data={data}/>
		{/if}
	{:else}
		<h2 class="text-xl text-center">Loading ...</h2>
	{/if}
</div>

<style lang="postcss">
	.tree {
		--json-tree-string-color: white;
		--json-tree-boolean-color: white;
		--json-tree-number-color: white;
		--json-tree-label-color: green;
		--json-tree-operator-color: gray;
		/*
    --json-tree-symbol-color: white;
    --json-tree-function-color: white;
    --json-tree-null-color: white;
    --json-tree-undefined-color: white;
    --json-tree-date-color: white;
    --json-tree-internal-color: white;
    --json-tree-regex-color: white; */

		--json-tree-arrow-color: white;
		--json-tree-property-color: white;

		--json-tree-li-indentation: 1em;
		--json-tree-li-line-height: 1.3;

		--json-tree-font-size: 12px;
		--json-tree-font-family: 'Courier New', Courier, monospace;
	}
</style>
