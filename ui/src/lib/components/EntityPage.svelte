<script lang="ts">
	import ArrayWrap from './ArrayWrap.svelte';
	export let data: any = undefined;
	import { afterUpdate, onMount, tick } from 'svelte';
	import TreeWrapper from './treeWrapper.svelte';
	import { apiService, clearCache } from '$lib/requests';
	import { goto } from '$app/navigation';
	import { page, navigating, updated } from '$app/stores';
	import { delay, capitalizeFirstLetter, getPluginPriorityMap, getPlugins, writeToClipboard } from '$lib/util';
	import { addToast, confirmToast, errorToast, infoToast } from '$lib/toastStore';
	import { confirm } from '$lib/confirmStore';
	import {
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
	import { fieldOrder, sortObjectFieldsByOrder, staticConfig, yamlDumpOptions } from '$lib/config';
	import type { IKongEntity, IKongPlugin } from '$lib/types';
	import { base } from '$app/paths';
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
	let entitySchema: any | undefined;
	let pluginSchema: any | undefined;

	let prevSearch = '';
	$: if ($page.url.pathname.endsWith('/entity')) {
		const params = new URLSearchParams($page.url.search);
		params.delete('tab');
		const search = params.toString();
		if (search !== prevSearch) {
			prevSearch = search;
			load();
		}
		activeTab = $page.url.searchParams.get('tab') ?? 'details';
	}

	function setTab(tab: string) {
		activeTab = tab;
		const url = new URL(window.location.toString());
		if (tab === 'details') {
			url.searchParams.delete('tab');
		} else {
			url.searchParams.set('tab', tab);
		}
		history.pushState(null, '', url);
	}

	let isMounted = false;

	let info: any;

	onMount(async () => {
		isMounted = true;
		info = await getPluginPriorityMap();
		await load();
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
		const searchParams = get(page).url.searchParams;
		entityType = searchParams.get('type') ?? 'none';
		id = searchParams.get('id') ?? 'none';
		let edited = searchParams.get('isEdited') ?? '';
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

			currentEntity = get(preferences.kongEntities).find((ent) => ent.name == entityType);
			subEntities = [];
			for (const entity of currentEntity?.subEntities ?? []) {
				const found = get(preferences.kongEntities).find((ent) => ent.name == entity);
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
		// load entity schema
		entitySchema = undefined;
		pluginSchema = undefined;
		relevantPlugins = [];
		const schemaRes = await (await apiService()).schema(entityType);
		if (schemaRes.ok && schemaRes.data) {
			entitySchema = {};
			for (const field of schemaRes.data.fields) {
				const entries = Object.entries(field)[0];
				entitySchema[entries[0]] = entries[1];
			}
		}
		// load plugin schema if entity is a plugin
		if (entityType === 'plugins' && data?.name) {
			const pluginRes = await (await apiService()).pluginConfig(data.name);
			if (pluginRes.ok && pluginRes.data) {
				let configSchema = pluginRes.data.fields.find((i) => Object.entries(i)[0][0] == 'config');
				if (configSchema) {
					pluginSchema = {};
					for (const param of configSchema.config.fields) {
						const entries = Object.entries(param)[0];
						pluginSchema[entries[0]] = entries[1];
					}
				}
			}
		}

		if (entityType !== 'plugins') {
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

		// trigger highlight after DOM settles
		if (edited == 'true') {
			setTimeout(() => {
				isEdited = edited == 'true';
				triggerHighlight('deferred edit on load');
			}, 10);
		}
	}

	let openedPlugins: any = {};
	let activeTab = 'details';

	async function deleteEntity(type: string, id: string, name: string) {
		const conf = await confirm({
			title: 'Delete entity',
			message: `Please confirm deletion of '${name}'`,
			variant: 'danger',
			confirmText: 'Delete'
		});
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
		format();
		const changedFields = getChangedFields(stateJson, json);
		const a = await confirm({
			message: changedFields.length > 0
				? `${changedFields.length} field${changedFields.length > 1 ? 's' : ''} modified`
				: 'Confirm save?',
			variant: 'info',
			confirmText: 'Save',
			changes: changedFields
		});
		if (!a) {
			return;
		}
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

	const max = 10;
	async function triggerHighlight(caller = '', selfCalled = 0) {
		if (selfCalled > max) {
			errorToast('highlight not triggered!');
			return;
		}
		json = json.replace(/\t/g, '  ');
		json = json.replace(/\s\n$/g, '\n ');

		if (!editorSyntax) {
			await tick();
			await delay(50);
			await triggerHighlight(caller, selfCalled + 1);
			return;
		}
		editorSyntax.textContent = json;
		(globalThis as any).Prism.highlightElement(editorSyntax);
		console.log(`prim highlight ok. try ${selfCalled} by '${caller}' at ${DateTime.now().toISO()}`);
	}
	let showPluginOrder = preferences.showPluginOrder;

	let pluginConfigContainer: HTMLElement;
	afterUpdate(() => {
		if (pluginConfigContainer) {
			pluginConfigContainer.querySelectorAll('code.language-json').forEach((el) => {
				(globalThis as any).Prism.highlightElement(el);
			});
		}
	});

	function setTextareaHeight() {
		editorWindow.style.height = editorWindow.scrollHeight + 3 + 'px';
	}

	function getChangedFields(oldJson: string, newJson: string): { field: string; oldValue: string; newValue: string }[] {
		try {
			const oldObj = JSON.parse(oldJson);
			const newObj = JSON.parse(newJson);
			const changes: { field: string; oldValue: string; newValue: string }[] = [];
			const allKeys = new Set([...Object.keys(oldObj), ...Object.keys(newObj)]);
			for (const key of allKeys) {
				const oldVal = JSON.stringify(oldObj[key] ?? null, null, 2);
				const newVal = JSON.stringify(newObj[key] ?? null, null, 2);
				if (oldVal !== newVal) {
					changes.push({
						field: key,
						oldValue: oldObj[key] === undefined ? '—' : truncateValue(oldVal),
						newValue: newObj[key] === undefined ? '—' : truncateValue(newVal)
					});
				}
			}
			return changes;
		} catch { return []; }
	}

	function truncateValue(val: string, max = 80): string {
		return val.length > max ? val.slice(0, max) + '…' : val;
	}

	function handleEntityKeydown(e: KeyboardEvent) {
		if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;
		if (e.key === 'e' && !isEdited && data) {
			e.preventDefault();
			flipIsEdited();
		} else if (e.key === 'd' && !isEdited && data) {
			e.preventDefault();
			deleteEntity(entityType, id, data.name ?? data.id);
		} else if (e.key === 'Escape' && isEdited) {
			e.preventDefault();
			flipIsEdited();
		}
	}
</script>

<svelte:window
	on:keydown={handleEntityKeydown}
	on:popstate={() => (activeTab = new URL(window.location.href).searchParams.get('tab') ?? 'details')}
/>

<svelte:head>
	<title>{data?.name ?? data?.id ?? staticConfig.name}</title>
</svelte:head>

<div class="mb-2">
	{#if data}
		<!-- Entity header -->
		<div class="flex items-center justify-between p-5 border-b border-[var(--glass-border)]">
			<div class="flex items-center gap-3">
				{#if entityType && entityType !== 'none'}
					<span class="text-[11px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)]">
						{entityType}
					</span>
				{/if}
				<h1 class="text-xl font-semibold">{data.name || data.id || '…'}</h1>
				{#if data.name && data.id}
					<span class="text-xs font-mono text-[var(--text-tertiary)]">{data.id}</span>
				{/if}
			</div>
			{#if data.enabled !== undefined}
				<div class="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
					<div class="h-2 w-2 rounded-full {data.enabled ? 'bg-[var(--success)]' : 'bg-[var(--danger)]'}"></div>
					{data.enabled ? 'Enabled' : 'Disabled'}
				</div>
			{/if}
		</div>

		<!-- Actions -->
		<div class="flex flex-row flex-wrap items-center gap-2 px-5 py-3 border-b border-[var(--glass-border)]">
			<button
				class="btn-accent"
				on:click={() => {
					flipIsEdited();
				}}
			>
				<FilePenOutline size="sm" />Edit
			</button>
			{#if !isEdited}
				<button
					class="btn-danger-ghost"
					title="delete"
					on:click={async () => await deleteEntity(entityType, id, data.name ?? data.id)}
				>
					<TrashBinOutline size="sm" />Delete
				</button>

				<div class="w-px h-6 bg-[var(--glass-border)] mx-1"></div>

				<button
					class="btn-ghost"
					title={stateJson}
					on:click={() => {
						writeToClipboard(stateJson);
					}}
				>
					<FileCopyOutline size="sm" />JSON
				</button>
				<button
					class="btn-ghost"
					title={stateJson}
					on:click={() => {
						writeToClipboard(dump(JSON.parse(stateJson), yamlDumpOptions));
					}}
				>
					<FileCopyAltOutline size="sm" />YAML
				</button>
				<button
					class="btn-ghost"
					on:click={() => {
						const obj = JSON.parse(stateJson);
						for (const field of get(preferences.stripFieldsOnCleanCopy)) {
							obj[field] = undefined;
						}
						writeToClipboard(dump(obj, yamlDumpOptions));
					}}
				>
					<FileCopyAltOutline size="sm" />YAML clean
				</button>
			{:else}
				<button
					class="btn-glass"
					on:click={() => {
						setTextareaHeight();
						highlightDisabled = !highlightDisabled;
					}}
					title="might be needed for json with long strings"
				>
					<CodeOutline size="sm" />Highlight
				</button>
				<button
					class="btn-accent"
					on:click={format}
					title={stateJson == json ? 'entity unchanged' : ''}
					disabled={stateJson == json}
				>
					<PaletteOutline size="sm" />Format
				</button>
				<button
					class="btn-success"
					disabled={stateJson == json}
					title={stateJson == json ? 'entity unchanged' : ''}
					on:click={async () => await save()}
				>
					<FloppyDiskAltOutline size="sm" />Save
				</button>
			{/if}
		</div>
		<div
			class="editor dark:bg-[#1E2021] w-full min-h-[60vh] line-numbers {isEdited
				? 'grid'
				: 'hidden'}"
		>
			<pre class="language-json dark:bg-zinc-900 {highlightDisabled ? 'hidden' : ''}"><code
					class="dark:bg-zinc-900"
					bind:this={editorSyntax}></code></pre>
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
		{#if isEdited && pluginSchema}
			<h2 class="text-xl m-4">'config' fields:</h2>
			<TreeWrapper
				data={pluginSchema}
				expandLevel={0}
				allowCopy={false}
				allowKeyCopy={true}
			/>
		{/if}
		{#if isEdited && entitySchema}
			<h2 class="text-xl mx-4 mb-4 mt-4">
				{entityType.substring(0, entityType.length - 1)} schema
			</h2>
			<TreeWrapper
				data={entitySchema}
				expandLevel={0}
				allowCopy={false}
				allowKeyCopy={false}
			/>
		{/if}
		<div class={isEdited ? 'hidden' : ''}>
			<!-- Tab bar -->
			{#if subEntities && subEntities.length > 0}
				<div class="flex items-center gap-1 px-5 py-2.5 border-b border-[var(--glass-border)]">
					<button
						class="px-3 py-2 text-sm font-medium rounded-lg transition-colors {activeTab === 'details' ? 'text-[var(--text-primary)] bg-[var(--accent)]/10' : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'}"
						on:click={() => setTab('details')}
					>Details</button>
				{#if relevantPlugins.length > 0}
					<button
						class="px-3 py-2 text-sm font-medium rounded-lg transition-colors {activeTab === 'plugin_order' ? 'text-[var(--text-primary)] bg-[var(--accent)]/10' : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'}"
						on:click={() => { setTab('plugin_order'); showPluginOrder.set(true); }}
					>Execution Order ({relevantPlugins.length})</button>
				{/if}
					{#each subEntities as subEntity}
						<button
							class="px-3 py-2 text-sm font-medium rounded-lg transition-colors {activeTab === subEntity.name ? 'text-[var(--text-primary)] bg-[var(--accent)]/10' : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'}"
							on:click={() => setTab(subEntity.name)}
						>{capitalizeFirstLetter(subEntity.name)} {subEntity.data ? `(${get(subEntity.data).length})` : ''}</button>
					{/each}
				</div>
			{/if}

			<!-- Tab: Details -->
			<div class={activeTab === 'details' ? 'px-5 pt-4 pb-5' : 'hidden'}>
				<div class="rounded-xl border border-[var(--glass-border)] overflow-hidden">
					<TreeWrapper
						{data}
						rounded={false}
						type={entityType}
						on:refresh={() => {
							load();
						}}
					/>
				</div>
			</div>

			<!-- Tab: Plugin Execution Order -->
			<div class={activeTab === 'plugin_order' ? '' : 'hidden'}>
				{#if relevantPlugins && relevantPlugins.length > 0}
					<div bind:this={pluginConfigContainer} class="flex flex-wrap items-center gap-2 p-5">
						{#each relevantPlugins as plugin}
							<div class="glass rounded-xl">
								<div
									class="flex flex-row items-center cursor-pointer p-3 gap-2"
									on:click={() => {
										openedPlugins[plugin.id] = !openedPlugins[plugin.id];
										openedPlugins = openedPlugins;
									}}
									role="button"
									tabindex="0"
									on:keydown={(e) => { if (e.key === 'Enter') { openedPlugins[plugin.id] = !openedPlugins[plugin.id]; openedPlugins = openedPlugins; } }}
								>
									{#if plugin.service}
										<div class="h-5 w-5" title="service plugin. priority={plugin.priority}">
											{@html icons['globe']}
										</div>
									{:else if plugin.route}
										<div class="h-5 w-5" title="route plugin. priority={plugin.priority}">
											{@html icons['shuffle']}
										</div>
									{/if}
									<p class="text-sm font-medium">{plugin.name}</p>
									<Link
										classes="ml-1"
										href="{base}/entity?type=plugins&id={plugin.id}"
										title="open {plugin.name} page"
									/>
								</div>
								{#if openedPlugins[plugin.id]}
									<pre class="language-json m-0 p-4 w-full dark:bg-[#1E2021] bg-white rounded-none" style="font-family: 'JetBrains Mono', monospace; font-size: 14px; line-height: 1.6;"><code class="language-json dark:bg-[#1E2021] bg-white">{JSON.stringify(plugin.config, null, 2)}</code></pre>
								{/if}
							</div>
							{#if relevantPlugins.indexOf(plugin) + 1 != relevantPlugins.length}
								<span class="text-xl text-[var(--text-tertiary)]">→</span>
							{/if}
						{/each}
					</div>
				{:else}
					<p class="p-5 text-sm text-[var(--text-tertiary)]">No plugins attached.</p>
				{/if}
			</div>

			<!-- Tab: Sub-entities -->
			{#if subEntities}
				{#each subEntities as subEntity}
					<div class={activeTab === subEntity.name ? '' : 'hidden'}>
						<div class="flex items-center gap-2 px-5 pt-4">
							<a
								class="btn-accent"
								href="{base}/add?type={subEntity.name}&apiPostPath={btoa(subEntity.entitySubPath)}&prefix={subEntityPrefix}"
								on:click|preventDefault={() => goto(`${base}/add?type=${subEntity.name}&apiPostPath=${btoa(subEntity.entitySubPath)}&prefix=${subEntityPrefix}`)}
							>
								<CirclePlusOutline size="sm" />Add {subEntity.name}
							</a>
						</div>
						{#if subEntity.data && get(subEntity.data).length > 0}
							<ArrayWrap
								dataRaw={subEntity.data}
								type={subEntity.name}
								entity={subEntity}
								pathPrefix={subEntityPrefix}
								on:refresh={async () => await load()}
							/>
						{:else}
							<p class="p-5 text-sm text-[var(--text-tertiary)]">No {subEntity.name} found.</p>
						{/if}
					</div>
				{/each}
			{/if}
		</div>
	{:else}
		<!-- Loading skeleton mimicking entity page structure -->
		<div class="animate-pulse">
			<!-- Header -->
			<div class="flex items-center justify-between p-5 border-b border-[var(--glass-border)]">
				<div class="flex items-center gap-3">
					<div class="h-7 w-20 rounded-lg bg-black/[0.06] dark:bg-white/[0.06]"></div>
					<div class="h-7 w-56 rounded-lg bg-black/[0.08] dark:bg-white/[0.08]"></div>
					<div class="h-5 w-64 rounded bg-black/[0.04] dark:bg-white/[0.04]"></div>
				</div>
			</div>
			<!-- Action bar -->
			<div class="flex items-center gap-2 px-5 py-3 border-b border-[var(--glass-border)]">
				<div class="h-10 w-24 rounded-xl bg-black/[0.06] dark:bg-white/[0.06]"></div>
				<div class="h-10 w-24 rounded-xl bg-black/[0.05] dark:bg-white/[0.05]"></div>
				<div class="w-px h-6 bg-[var(--glass-border)]"></div>
				<div class="h-10 w-20 rounded-xl bg-black/[0.04] dark:bg-white/[0.04]"></div>
				<div class="h-10 w-20 rounded-xl bg-black/[0.04] dark:bg-white/[0.04]"></div>
				<div class="h-10 w-28 rounded-xl bg-black/[0.04] dark:bg-white/[0.04]"></div>
			</div>
			<!-- Tab bar -->
			<div class="flex items-center gap-2 px-5 py-2 border-b border-[var(--glass-border)]">
				<div class="h-8 w-16 rounded-lg bg-black/[0.06] dark:bg-white/[0.06]"></div>
				<div class="h-8 w-28 rounded-lg bg-black/[0.04] dark:bg-white/[0.04]"></div>
				<div class="h-8 w-20 rounded-lg bg-black/[0.03] dark:bg-white/[0.03]"></div>
			</div>
			<!-- Key-value table -->
			<div class="mx-5 mt-4 rounded-xl border border-[var(--glass-border)] divide-y divide-[var(--glass-border)]">
				{#each Array(10) as _, i}
					<div class="flex items-center gap-6 px-5 py-4">
						<div class="h-4 w-[160px] rounded bg-black/[0.06] dark:bg-white/[0.06]" style="opacity: {1 - i * 0.06}"></div>
						<div class="h-4 rounded bg-black/[0.04] dark:bg-white/[0.04] flex-1 max-w-[400px]" style="opacity: {1 - i * 0.05}"></div>
					</div>
				{/each}
			</div>
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
