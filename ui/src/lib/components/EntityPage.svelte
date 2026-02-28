<script lang="ts">
	import ArrayWrap from './ArrayWrap.svelte';
	export let data: any = {};
	import { Button } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import TreeWrapper from './treeWrapper.svelte';
	import { apiService, clearCache } from '$lib/requests';
	import { goto } from '$app/navigation';
	import { page, navigating, updated } from '$app/stores';
	import { delay, getPluginPriorityMap, getPlugins, writeToClipboard } from '$lib/util';
	import { addToast, confirmToast, errorToast, infoToast } from '$lib/toastStore';
	import {
		CaretDownOutline,
		CirclePlusOutline,
		CodeOutline,
		EditOutline,
		FileCopyAltOutline,
		FileCopyOutline,
		FilePenOutline,
		FloppyDiskAltOutline,
		PaletteOutline,
		TrashBinOutline
	} from 'flowbite-svelte-icons';
	import {
		fieldOrder,
		kongEntities,
		sortObjectFieldsByOrder,
		staticConfig,
		yamlDumpOptions
	} from '$lib/config';
	import type { IKongEntity, IKongPlugin } from '$lib/types';
	import { base } from '$app/paths';
	import Spinner from './Spinner.svelte';
	import { preferences } from '$lib/stores';
	import { get, writable, type Writable } from 'svelte/store';
	import { icons } from '$lib/icons';
	import Link from './Link.svelte';
	import { dump } from 'js-yaml';
	import { DateTime } from 'luxon';

	let stateJson = '';
	let json = '';

	let isEdited = false;
	let highlightDisabled = false;
	let id: string;
	let entityType: string;
	let pathPrefix: string = '';
	let subEntityPrefix: string = '';

	let currentEntity: IKongEntity | undefined;

	interface IEntities extends IKongEntity {
		data?: Writable<any[]>;
		entitySubPath: string;
	}
	let subEntities: IEntities[];
	let relevantPlugins: IKongPlugin[] = [];

	$: $page, load();

	let isMounted = false;

	let info: any;

	onMount(async () => {
		isMounted = true;
		info = await getPluginPriorityMap();
		await load();
		triggerHighlight('on mount');
	});

	function flipIsEdited() {
		isEdited = !isEdited;
		isEdited = isEdited;
		const url = new URL(window.location.toString());
		if (isEdited == true) {
			url.searchParams.set('isEdited', 'true');
		} else {
			url.searchParams.delete('isEdited');
		}
		history.pushState(null, '', url);
		json = stateJson;
		if (isEdited) {
			triggerHighlight('flip edit');
		}
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
			subEntities = [];
			for (const entity of currentEntity?.subEntities ?? []) {
				const found = kongEntities.find((ent) => ent.name == entity);
				if (!found) {
					continue;
				}
				subEntities.push({
					...found,
					entitySubPath: `${entityType}/${id}/${found.name}`
				});
			}
			for (const ent of subEntities) {
				const res2 = await (await apiService()).findAll(ent.name, {}, `/${entityType}/${id}`);
				if (!res2.ok) {
					errorToast(`failed to load ${ent.name}`);
					continue;
				}
				ent.data = writable(res2.data?.data as any[]);
				subEntities = subEntities;
			}
		}
		// triggerHighlight();

		const plugins = await getPlugins(`/${entityType}/${id}`);
		relevantPlugins = plugins;
		if (data.service) {
			const plugins = await getPlugins(`/services/${data.service.id}`);
			relevantPlugins = [...plugins, ...relevantPlugins];
		}

		relevantPlugins.sort((b, a) => {
			return info[a.name] - info[b.name];
		});
		relevantPlugins = relevantPlugins.map((plugin) => {
			return {
				...plugin,
				priority: info[plugin.name]
			};
		});
	}

	let openedPlugins: any = {};

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
		triggerHighlight('format');
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

		flipIsEdited();
		data = JSON.parse(json);
		stateJson = json;
		clearCache(id);
		load();
	}

	let editorWindow: HTMLTextAreaElement;
	let editorSyntax: HTMLElement;

	const max = 5;
	async function triggerHighlight(caller = '', selfCalled = 0) {
		if (selfCalled > max) {
			errorToast('highlight not triggered!');
			return;
		}
		json = json.replace(/\t/g, '  ');
		json = json.replace(/\s\n$/g, '\n ');

		if (!editorSyntax) {
			// needed as sometimes the function is called before the editor is added to the DOM
			await delay(20);
			await triggerHighlight(caller, selfCalled + 1);
			return;
		}
		editorSyntax.textContent = json;
		(globalThis as any).Prism.highlightElement(editorSyntax);
		console.log(`prim highlight ok. try ${selfCalled} by '${caller}' at ${DateTime.now().toISO()}`);
	}
	let showPluginOrder = preferences.showPluginOrder;

	function setTextareaHeight() {
		editorWindow.style.height = editorWindow.scrollHeight + 3 + 'px';
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
					flipIsEdited();
				}}
			>
				<FilePenOutline class="m-2" />edit
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
						writeToClipboard(dump(JSON.parse(stateJson), yamlDumpOptions));
					}}
				>
					<FileCopyAltOutline class="m-2" />
					copy YAML</Button
				>
			{:else}
				<Button
					class="h-10 m-1"
					on:click={() => {
						setTextareaHeight();
						highlightDisabled = !highlightDisabled;
						// triggerHighlight();
					}}
					color="blue"
					title="might be needed for json with long strings"
				>
					<CodeOutline class="m-2" />
					toggle syntax highlight
				</Button>
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
			<pre class="language-json dark:bg-zinc-900 {highlightDisabled ? 'hidden' : ''}"><code class="dark:bg-zinc-900" bind:this={editorSyntax}
				></code></pre>
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
					setTextareaHeight();
					triggerHighlight('on input to textarea');
				}}
			></textarea>
		</div>
		<div class="{isEdited? "hidden": ""}">

			<TreeWrapper
				{data}
				rounded={false}
				type={entityType}
				on:refresh={() => {
					load();
				}}
			/>
			<Button
				color="alternative"
				class="h-10 m-1 ml-4"
				title="show plugin execution order"
				on:click={() => {
					showPluginOrder.set(!get(showPluginOrder));
					openedPlugins = {};
				}}
			>
				<CaretDownOutline class="m-2" />
				show plugin order</Button
			>
			{#if relevantPlugins && $showPluginOrder}
				<div class="flex flex-wrap items-center p-4">
					{#each relevantPlugins as plugin}
						<div class="border border-stone-600 rounded-lg dark:border-stone-600 my-2">
							<div
								class="flex flex-row items-center cursor-pointer p-4"
								on:click={() => {
									if (openedPlugins[plugin.id]) {
										openedPlugins[plugin.id] = !openedPlugins[plugin.id];
									} else {
										openedPlugins[plugin.id] = true;
									}
									openedPlugins = openedPlugins;
								}}
							>
								{#if plugin.service}
									<div class="mr-1 h-6 w-6" title="service plugin. priority={plugin.priority}">
										{@html icons['globe']}
									</div>
								{:else if plugin.route}
									<div class="mr-1 h-6 w-6" title="route plugin. priority={plugin.priority}">
										{@html icons['shuffle']}
									</div>
								{/if}
								<p class="ml-2 cursor-pointer">
									{plugin.name}
								</p>
								<Link
									classes="pl-3"
									href="{base}/entity?type=plugins&id={plugin.id}"
									title="open {plugin.name} page"
								/>
							</div>
							{#if openedPlugins[plugin.id]}
								<TreeWrapper expandFields={[]} data={plugin.config}></TreeWrapper>
								<!-- content here -->
							{/if}
						</div>
						{#if relevantPlugins.indexOf(plugin) + 1 != relevantPlugins.length}
							<span class="text-3xl text-center p-1">→</span>
						{/if}
					{/each}
				</div>
			{/if}
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
					{#if subEntity.data && get(subEntity.data).length > 0}
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
		</div>
	{:else}
		<div class="flex flex-row items-center m-4">
			<Spinner
				uppercased={false}
				text="loading {entityType.substring(0, entityType.length - 1)} with id='{id}'"
			/>
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
		caret-color: gray;
		overflow: hidden;
		resize: none;
		width: 100%;
		color: rgba(255, 255, 255, 0.1);
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

	code {
		overflow-x: hidden;
		word-wrap: break-word;
		resize: none;
	}

</style>
