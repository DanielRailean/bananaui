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
		PaletteOutline,
		TrashBinOutline
	} from 'flowbite-svelte-icons';
	import { fieldOrder, kongEntities, sortObjectFieldsByOrder } from '$lib/config';
	import type { IKongEntity } from '$lib/types';
	import { base } from '$app/paths';

	let stateJson = '';
	let json = '';

	let isEdited = false;
	let id: string;
	let entityType: string;

	let currentEntity: IKongEntity | undefined;

	interface IEntities extends IKongEntity {
		data?: any[];
		entitySubPath: string;
	}
	let subEntities: IEntities[];

	$: $page, load();

	let isMounted = false;

	onMount(() => {
		isMounted = true;
		load();
	});

	async function load() {
		if (!isMounted) {
			return;
		}
		data = undefined;
		const searchParams = new URLSearchParams(window.location.search);
		entityType = searchParams.get('type') ?? 'none';
		id = searchParams.get('id') ?? 'none';
		{
			data = undefined;
			const res = await (await apiService()).findRecord(entityType, id);
			data = res.data;
			data = sortObjectFieldsByOrder(data, fieldOrder);
			json = JSON.stringify(data, undefined, 2);
			stateJson = json;

			currentEntity = kongEntities.find((ent) => ent.name == entityType);
			subEntities = kongEntities
				.filter((subEnt) => currentEntity?.subEntities?.includes(subEnt.name))
				.map((subEnt) => {
					return {
						...subEnt,
						entitySubPath: `${entityType}/${id}/${subEnt.name}`
					};
				});
			for (const ent of subEntities) {
				const res2 = await (await apiService()).findAll(ent.name, {}, `/${entityType}/${id}`);
				if (!res2.ok) {
					addToast({ message: `failed to load ${ent.name}` });
					continue;
				}
				ent.data = res2.data?.data as any[];
				subEntities = subEntities;
			}
		}
		triggerHighlight()
	}

	async function deleteEntity(type: string, id: string, name: string) {
		const conf = confirm(`Please confirm deletion of '${name}'`);
		if (!conf) {
			return;
		}
		const res = await (await apiService()).deleteRecord(type, id);
		if (!res.ok) {
			addToast({ message: `failed to delete. ${res.err}` });
		} else {
			addToast({ message: `ok`, type: `info` });
			goto(`${base}/entities?type=${entityType}`);
		}
	}

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
			const res = await (await apiService()).updateRecord(entityType, id, JSON.parse(json));

			isEdited = !isEdited;
			isEdited = isEdited;
			data = JSON.parse(json);
			stateJson = json;
		} catch (error: any) {
			const err = error.response.data as any as Error;
			addToast({ message: err.message });
		}
	}
	let editorWindow: HTMLTextAreaElement;
	let editorSyntax: HTMLElement;

	async function triggerHighlight() {
		json = json.replace(/\t/g, '  ');
		if (!editorSyntax) {
			return;
		}
		editorSyntax.textContent = json;

		// Highlight the syntax
		(globalThis as any).Prism.highlightElement(editorSyntax);
	}
</script>

<svelte:head>
	<link rel="stylesheet" href="https://unpkg.com/dracula-prism/dist/css/dracula-prism.css" />
</svelte:head>

<div class="mb-2">
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
			class="h-8 p-2 mr-2"
			title="delete"
			color="alternative"
			on:click={async () => await deleteEntity(entityType, id, data.name ?? data.id)}
		>
			<div class="text-rose-500">
				<div class="flex flex-row items-center">
					<TrashBinOutline class="m-1" />
					delete
				</div>
			</div>
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
		<div
			class="editor dark:bg-[#1E2021] w-full min-h-[30vh] line-numbers {isEdited
				? 'grid'
				: 'hidden'}"
		>
			<pre class="language-json"><code bind:this={editorSyntax}></code></pre>
			<textarea
				bind:this={editorWindow}
				spellcheck="false"
				wrap="hard"
				autocorrect="off"
				autocapitalize="off"
				translate="no"
				class="relative"
				bind:value={json}
				on:input={() => {
					triggerHighlight();
				}}
			></textarea>
		</div>
		{#if !isEdited}
			<TreeWrapper
				{data}
				rounded={false}
				type={entityType}
				on:refresh={() => {
					load();
				}}
			/>
			{#if subEntities}
				{#each subEntities as subEntity}
					<div class="flex flex-row m-4 h-8 items-center">
						<div class="flex flex-row h-8">
							<Button
								color="alternative"
								on:click={() => {
									goto(
										`${base}/add?type=${subEntity.name}&apiPostPath=${btoa(
											subEntity.entitySubPath
										)}`
									);
								}}
							>
								<a
									href="{base}/add?type={subEntity.name}&apiPostPath={btoa(
										subEntity.entitySubPath
									)}"
								>
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
							dataRaw={subEntity.data}
							type={subEntity.name}
							entity={subEntity}
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

<style>
	.editor {
		grid-template-columns: 1fr;
		grid-template-rows: 1fr;
		gap: 0;
	}

	.editor pre,
	.editor textarea {
		grid-area: 1 / 1 / 2 / 2;
	}

	.editor textarea {
		background-color: transparent;
		border: none;
		color: transparent;
		caret-color: gray;
		overflow: hidden;
		resize: none;
		width: 100%;
	}

	textarea,
	pre {
		padding: 0;
		margin: 0;
	}

	textarea,
	pre,
	code {
		outline: none;
		border: none;
		box-shadow: none;
		font-family: 'JetBrains Mono', monospace;
		font-size: 20px;
		line-height: 30px;
		border-radius: 0;
		white-space: break-spaces;
	}

	textarea,
	pre {
		padding: 10px;
		padding-left: 60px;
	}

	code,
	pre {
		@apply dark:bg-zinc-900 bg-stone-800;
	}
</style>
