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
	import * as yaml from "js-yaml"
	import { addToast, confirmToast, errorToast, infoToast } from '$lib/toastStore';
	import {
		CirclePlusOutline,
		EditOutline,
		FileCopyOutline,
		FloppyDiskAltOutline,
		PaletteOutline,
		TrashBinOutline
	} from 'flowbite-svelte-icons';
	import { fieldOrder, kongEntities, sortObjectFieldsByOrder, staticConfig } from '$lib/config';
	import type { IKongEntity } from '$lib/types';
	import { base } from '$app/paths';
	import Spinner from './Spinner.svelte';

	let stateJson = '';
	let json = '';

	let isEdited = false;
	let id: string;
	let entityType: string;
	let pathPrefix: string = '';
	let subEntityPrefix: string = '';

	let currentEntity: IKongEntity | undefined;

	interface IEntities extends IKongEntity {
		data?: any[];
		entitySubPath: string;
	}
	let subEntities: IEntities[];

	$: $page, load();

	let isMounted = false;

	const yamlOptions: yaml.DumpOptions = {
		noArrayIndent : true,
		noRefs: true,
		noCompatMode: true,
		quotingType: '"',
	}

	onMount(() => {
		isMounted = true;
		load();
		setTimeout(() => {
			triggerHighlight()
		}, 100)
	});

	function updateIsEdited() {
		const url = new URL(window.location.toString());
		if (isEdited == true) {
			url.searchParams.set('isEdited', 'true');
		} else {
			url.searchParams.delete('isEdited');
		}
		history.pushState(null, '', url);
	}

	async function load() {
		if (!isMounted) {
			return;
		}
		data = undefined;
		isEdited = false;
		const searchParams = new URLSearchParams(window.location.search);
		entityType = searchParams.get('type') ?? 'none';
		id = searchParams.get('id') ?? 'none';
		let edited = searchParams.get('isEdited') ?? '';
		isEdited = edited == 'true';
		pathPrefix = searchParams.get('prefix') ?? '';
		if (entityType == 'upstreams') {
			subEntityPrefix = `/upstreams/${id}`;
		}
		{
			data = undefined;
			const res = await (await apiService()).findRecord(entityType, id, pathPrefix);
			if (!res.ok) {
				errorToast(`failed to fetch ${entityType} with id ${id}. Status code: ${res.code}`);
				await goto(`${base}/entities?type=services`);
			}
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
					errorToast(`failed to load ${ent.name}`);
					continue;
				}
				ent.data = res2.data?.data as any[];
				subEntities = subEntities;
			}
		}
		triggerHighlight();
	}

	async function deleteEntity(type: string, id: string, name: string) {
		const conf = confirm(`Please confirm deletion of '${name}'`);
		if (!conf) {
			return;
		}
		const res = await (await apiService()).deleteRecord(type, id, pathPrefix);
		if (!res.ok) {
			errorToast(`failed to delete. ${res.err}`);
		} else {
			confirmToast(`deleted`);
			goto(`${base}/entities?type=${entityType}&prefix=${pathPrefix}`);
		}
	}

	function format() {
		let parsed: any | undefined;
		try {
			parsed = JSON.parse(json);
		} catch (err: any) {
			errorToast(`Failed to parse JSON. ${err.message}`);
			return;
		}
		json = JSON.stringify(parsed, undefined, 2);
		triggerHighlight();
		confirmToast(`json is valid`);
	}
	async function save() {
		const a = confirm('confirm save?');
		if (!a) {
			return;
		}
		format();
		const res = await (
			await apiService()
		).updateRecord(entityType, id, JSON.parse(json), pathPrefix);
		console.log(res);
		if (!res.ok) {
			errorToast(
				(`API error (${res.code}): ` + ((res.errTyped as any)?.message ?? res.err)) as string,
				true,
				15000
			);
			return;
		} else {
			confirmToast(`entity successfully updated`);
		}

		isEdited = !isEdited;
		isEdited = isEdited;
		data = JSON.parse(json);
		stateJson = json;
	}

	let editorWindow: HTMLTextAreaElement;
	let editorSyntax: HTMLElement;

	async function triggerHighlight() {
		json = json.replace(/\t/g, '  ');
		json = json.replace(/\s\n$/g, '\n ');

		if (!editorSyntax) {
			return;
		}
		editorSyntax.textContent = json;

		// Highlight the syntax
		(globalThis as any).Prism.highlightElement(editorSyntax);
	}
</script>

<svelte:head>
	<title>{data?.name ?? data?.id ?? staticConfig.name}</title>
</svelte:head>

<div class="mb-2">
	{#if data}
	<div class="flex flex-row flex-wrap m-2">
		<Button
			class="h-10 m-1 focus:shadow-none"
			on:click={() => {
				isEdited = !isEdited;
				updateIsEdited();
				triggerHighlight();
			}}
		>
			<EditOutline class="m-2" />edit
		</Button>
		{#if !isEdited}
			<Button
				class="h-10 m-1"
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
				class="h-10 m-1"
				title={stateJson}
				on:click={() => {
					writeToClipboard(stateJson);
				}}
			>
				<FileCopyOutline class="m-2" />
				copy JSON</Button
			>
			<Button
				color="alternative"
				class="h-10 m-1"
				title={stateJson}
				on:click={() => {
					writeToClipboard(yaml.dump(JSON.parse(stateJson), yamlOptions));
				}}
			>
				<FileCopyOutline class="m-2" />
				copy YAML</Button
			>
		{:else}
			<Button
				class="h-10 m-1"
				on:click={format}
				color="blue"
				title={stateJson == json ? 'entity unchanged' : ''}
				disabled={stateJson == json}
			>
				<PaletteOutline class="m-2" />
				format and validate JSON
			</Button>
			<Button
				class="h-10 m-1"
				disabled={stateJson == json}
				title={stateJson == json ? 'entity unchanged' : ''}
				on:click={async () => await save()}
				color="green"
			>
				<FloppyDiskAltOutline class="m-2" />
				save</Button
			>
		{/if}
	</div>
		<div
			class="editor dark:bg-[#1E2021] w-full min-h-[60vh] line-numbers {isEdited
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
						<div class="flex flex-row h-10">
							<Button
								color="alternative"
								on:click={() => {
									goto(
										`${base}/add?type=${subEntity.name}&apiPostPath=${btoa(
											subEntity.entitySubPath
										)}&prefix=${subEntityPrefix}`
									);
								}}
							>
								<a
									href="{base}/add?type={subEntity.name}&apiPostPath={btoa(
										subEntity.entitySubPath
									)}&prefix={subEntityPrefix}"
								>
									<div class="flex flex-row items-center">
										<CirclePlusOutline class="m-2" />
										add {subEntity.name}
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
							pathPrefix={subEntityPrefix}
							on:refresh={async () => await load()}
						/>
					{/if}
				{/each}
			{/if}
		{/if}
	{:else}
		<div class="flex flex-row items-center m-4">
			<Spinner uppercased={false} text="loading {entityType.substring(0,entityType.length-1)} with id='{id}'"/>
		</div>
	{/if}
</div>

<style lang="postcss">
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
		color: rgba(255, 255, 255, 0.1);
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
		padding-left: 75px;
	}

	code,
	pre {
		@apply dark:bg-zinc-900 bg-stone-800;
	}
</style>
