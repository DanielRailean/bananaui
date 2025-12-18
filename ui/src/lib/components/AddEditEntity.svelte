<script lang="ts">
	import TreeWrapper from './treeWrapper.svelte';
	import type { IPlugins, IResCreateError, ISchemaRes } from '$lib/responseTypes';
	import type { IEntityBase, IKongEntity } from '$lib/types';
	import type { ResWrapped } from '$lib/requests';
	import { goto } from '$app/navigation';
	import { apiService, clearCache } from '$lib/requests';
	import { onMount } from 'svelte';
	import { Button, Label, Select } from 'flowbite-svelte';
	import { addToast, errorToast, infoToast } from '$lib/toastStore';
	import { FloppyDiskAltOutline, LinkOutline, PaletteOutline } from 'flowbite-svelte-icons';
	import { base } from '$app/paths';
	import { kongEntities } from '$lib/config';

	let entity: IKongEntity | undefined;

	let json = '';
	let dummyObject: any = {};
	let postPath: string | undefined;
	let entitySchema: any | undefined;
	let pluginSchema: any | undefined;
	let selectedPlugin: any;
	let pluginSelect: any | undefined;
	let pathPrefix: string = '';

	function setEditField(name: string, value: any) {
		dummyObject[name] = value;
		dummyToJson();
	}

	function addField(key: string, value: any, subfield: string | undefined = undefined) {
		let temp = JSON.parse(json);
		if (subfield) {
			let temp2 = temp[subfield];
			temp2[key] = value;
			temp[subfield] = temp2;
		} else {
			temp[key] = value;
		}
		json = JSON.stringify(temp, undefined, 2);
		triggerHighlight();
	}

	function dummyToJson() {
		json = JSON.stringify(dummyObject, undefined, 2);
	}

	onMount(async () => {
		dummyObject = {};
		let query = new URLSearchParams(window.location.search);
		let path = query.get('apiPostPath');
		let type = query.get('type');
		pathPrefix = query.get('prefix') ?? '';
		if (type) {
			entity = kongEntities.find((i) => i.name == type);
		}
		if (!entity) {
			errorToast(`entity named ${type} not found!`);
			return;
		}
		if (path) {
			postPath = atob(path);
		}
		if (entity.name == 'plugins') {
			const res = await (await apiService()).getInfo();
			if (res.ok && res.data) {
				pluginSelect = Object.entries(res.data.plugins.available_on_server)
					.sort((a, b) => {
						return b[1].priority - a[1].priority;
					})
					.map((i) => {
						return {
							name: `${i[0]} - ${i[1].priority}`,
							value: i[0]
						};
					});
			}
		}
		const res = await (await apiService()).schema(entity.name);
		if (res.ok && res.data) {
			entitySchema = {};
			for (const field of res.data.fields) {
				const entries = Object.entries(field)[0];
				const key = entries[0];
				const value = entries[1];
				entitySchema[key] = value;
				if (value.required && !value.default) {
					dummyObject[key] = '';
				}
			}
			dummyToJson();
		}
		json = JSON.stringify(entity.defaultAddValue ?? dummyObject, undefined, 2);
		triggerHighlight();

		selectedPlugin = pluginSelect[Math.round(Math.random() * pluginSelect.length)].value;
		infoToast(`loaded schema for ${selectedPlugin} (selected randomly)`);
		pluginSelected();
	});

	function format(confirmOk = true) {
		let parsed: any | undefined;
		try {
			parsed = JSON.parse(json);
		} catch (err: any) {
			addToast({ message: `Failed to parse JSON. ${err.message}` });
			return;
		}
		json = JSON.stringify(parsed, undefined, 2);
		triggerHighlight();
		if (confirmOk) {
			addToast({ message: `json valid!`, type: 'info' });
		}
	}

	async function save() {
		format(false);
		try {
			let res: ResWrapped<IEntityBase, IResCreateError> | undefined;

			if (postPath) {
				res = await (
					await apiService()
				).request<IEntityBase, IResCreateError>(postPath, 'POST', JSON.parse(json));
			} else {
				res = await (await apiService()).createRecord(entity?.name ?? '', JSON.parse(json));
			}
			if (!res.ok) {
				addToast({
					message: (`API error (${res.code}): ` +
						((res.errTyped as any)?.message ?? res.err)) as string,
					timeout: 15000
				});
				return;
			}
			if (res.data?.id) {
				clearCache(entity?.name)
				goto(`${base}/entity?type=${entity?.name}&id=${res.data.id}&prefix=${pathPrefix}`);
			} else {
				addToast({ message: 'failed to read the new entity' });
				return;
			}
		} catch (error: any) {
			const err = error.response.data as any as Error;
			addToast({ message: err.message });
		}
	}
	async function pluginSelected() {
		addField('name', selectedPlugin);
		const res = await (await apiService()).pluginConfig(selectedPlugin);
		if (res.ok && res.data) {
			let configSchema = res.data.fields.find((i) => Object.entries(i)[0][0] == 'config');
			if (!configSchema) {
				addToast({ message: `failed to load config for ${selectedPlugin}` });
				return;
			}
			pluginSchema = {};
			for (const param of configSchema.config.fields) {
				const entries = Object.entries(param)[0];
				const key = entries[0];
				const value = entries[1];
				pluginSchema[key] = value;
			}
			const config = getDefaultFields(configSchema.config.fields, false);
			addField('config', config);
			triggerHighlight();
		}
	}

	function getDefaultFields(fields: any[], forcePopulate: boolean): any {
		const result: any = {};
		for (const param of fields) {
			const entries = Object.entries(param)[0];
			const key: string = entries[0];
			const value: any = entries[1];
			if (value.default || value.default === false) {
				result[key] = value.default;
				continue;
			}
			if (value.type == 'map') {
				result[key] = getDefault(value);
				continue;
			}
			if (value.required === true || forcePopulate) {
				result[key] = value.default ?? getDefault(value);
			}
			if (value.fields || value.type == 'record') {
				result[key] = getDefaultFields(value.fields, true);
				continue;
			}
		}
		return result;
	}

	let editorWindow: HTMLTextAreaElement;
	let editorSyntax: HTMLElement;

	async function triggerHighlight() {
		json = json.replace(/\t/g, '  ');
		editorSyntax.textContent = json;

		// Highlight the syntax
		(globalThis as any).Prism.highlightElement(editorSyntax);
	}

	function getDefault(schemaKey: any): any {
		if (schemaKey.default) {
			return schemaKey.default;
		}
		if (schemaKey.type == 'number' || schemaKey.type == 'integer') {
			return -1;
		}
		if (schemaKey.type == 'string') {
			return '';
		}
		if (schemaKey.type == 'array') {
			if (schemaKey.elements) {
				return [getDefault(schemaKey.elements)];
			}
			return [];
		}
		if (schemaKey.type == 'record') {
			if (schemaKey.fields) {
				return getDefaultFields(schemaKey.fields, true);
			}
			return {};
		}
		if (schemaKey.type == 'map') {
			const res: any = {};
			const key: any = getDefault(schemaKey.keys);
			res[key] = getDefault(schemaKey.values);
			return res;
		}
		infoToast(`default not found for: ${JSON.stringify(schemaKey)}`);
		return '';
	}
</script>

{#if entity}
	<div class="flex flex-col m-2">
		<div class="flex flex-row flex-wrap">
			<Button class="h-10 m-1" on:click={async () => await save()} color="green">
				<FloppyDiskAltOutline class="m-2" />
				save {entity?.name.substr(0, entity.name.length - 1)}
			</Button>
			<Button class="h-10 m-1" on:click={() => format(true)} color="blue">
				<PaletteOutline class="m-2" />
				format and validate JSON
			</Button>
			<Button class="h-10 m-1" color="alternative">
				<a target="_blank" href="https://docs.konghq.com/gateway/3.7.x/admin-api/">
					<div class="flex flex-row items-center">
						<LinkOutline class="m-2" />
						Open Admin API Docs in new tab
					</div>
				</a>
			</Button>
			{#if selectedPlugin}
				<Button class="h-10 m-1" color="alternative">
					<a target="_blank" href="https://docs.konghq.com/hub/kong-inc/{selectedPlugin}/">
						<div class="flex flex-row items-center">
							<LinkOutline class="m-2" />
							{selectedPlugin} plugin - configuration reference
						</div>
					</a>
				</Button>
			{/if}
		</div>
		{#if pluginSelect}
			<div class="my-2">
				<Label>
					Select a plugin to load it's configuration schema
					<Select
						class="mt-2"
						items={pluginSelect}
						bind:value={selectedPlugin}
						on:change={pluginSelected}
					/>
				</Label>
			</div>
		{/if}
	</div>
{/if}

<div class="dark:border-stone-700">
	<div class="editor dark:bg-[#1E2021] w-full min-h-[30vh] line-numbers">
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
</div>
{#if pluginSchema}
	<h2 class="text-xl m-4">'config' fields:</h2>
	<TreeWrapper
		data={pluginSchema}
		expandLevel={0}
		allowCopy={false}
		allowKeyCopy={true}
		keyClickHandler={(key) => {
			addField(key, getDefault(pluginSchema[key]), 'config');
			infoToast(`'config.${key}' added`);
		}}
		keyTitle={() => `click to add to config`}
	/>
{/if}
<br />
{#if entity?.name && entitySchema}
	<h2 class="text-xl mx-4 mb-4">
		{entity?.name.substring(0, entity?.name.length - 1)} schema
	</h2>
{/if}
<TreeWrapper
	data={entitySchema}
	keyClickHandler={(key) => {
		addField(key, entitySchema[key].default ?? '');
		infoToast(`'${key}' added`);
	}}
	keyTitle={() => `click to add to body`}
	expandLevel={0}
	allowCopy={false}
	allowKeyCopy={false}
/>

<style lang="postcss">
	.editor {
		display: grid;
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
		padding-left: 75px;
	}

	code,
	pre {
		@apply dark:bg-zinc-900 bg-stone-800;
	}
</style>
