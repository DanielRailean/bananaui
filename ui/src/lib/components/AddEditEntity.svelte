<script lang="ts">
	import TreeWrapper from './treeWrapper.svelte';
	import type { IPlugins, IResCreateError, ISchemaRes } from '$lib/responseTypes';
	import type { IEntityBase } from '$lib/types';
	import type { ResWrapped } from '$lib/requests';
	import { goto } from '$app/navigation';
	import { kongEntities } from '$lib/config';
	import { apiService } from '$lib/requests';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { Button, Label, Select } from 'flowbite-svelte';
	import { addToast } from '$lib/stores';
	import { FloppyDiskAltOutline, LinkOutline, PaletteOutline } from 'flowbite-svelte-icons';
	import { base } from '$app/paths';

	let entityKindToAdd: string;

	let json = '';
	let dummyObject: any = {};
	// let schema: ISchemaRes | undefined;
	let postPath: string | undefined;
	let testSchema: any | undefined;
	let pluginSchema: any | undefined;
	let selectedPlugin: any;
	let pluginSelect: any | undefined;

	function setEditField(name: string, value: any) {
		dummyObject[name] = value;
		dummyToJson();
	}

	function dummyToJson() {
		json = JSON.stringify(dummyObject, undefined, 2);
	}

	onMount(async () => {
		let query = new URLSearchParams(window.location.search);
		let path = query.get('apiPostPath');
		let type = query.get('type');
		if (type) {
			entityKindToAdd = type;
		}
		if (path) {
			postPath = atob(path);
		}
		if (entityKindToAdd == 'plugins') {
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
		const res = await (await apiService()).schema(entityKindToAdd);
		if (res.ok && res.data) {
			testSchema = {};
			for (const field of res.data.fields) {
				const entries = Object.entries(field)[0];
				const key = entries[0];
				const value = entries[1];
				testSchema[key] = value;
				if (value.required) {
					dummyObject[key] = value.default ?? null;
				}
			}
			dummyToJson();
		}
	});

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
		try {
			let res: ResWrapped<IEntityBase, IResCreateError> | undefined;

			if (postPath) {
				res = await (
					await apiService()
				).request<IEntityBase, IResCreateError>(postPath, 'POST', JSON.parse(json));
			} else {
				res = await (await apiService()).createRecord(entityKindToAdd, JSON.parse(json));
			}
			if (!res.ok || !res.data) {
				addToast({ message: res.errTyped?.message ?? res.err ?? 'Error occured' });
				return;
			}
			if (res.data.id) {
				goto(`${base}/entities?type=${entityKindToAdd}&id=${res.data.id}`);
			}
		} catch (error: any) {
			const err = error.response.data as any as Error;
			addToast({ message: err.message });
		}
	}
	async function pluginSelected() {
		setEditField('name', selectedPlugin);
		const res = await (await apiService()).pluginConfig(selectedPlugin);
		if (res.ok && res.data) {
			const config: any = {};
			let configSchema = res.data.fields.find((i) => Object.entries(i)[0][0] == 'config');
			if (!configSchema) {
				addToast({ message: `failed to load config for ${selectedPlugin}` });
				return;
			}
			console.log(configSchema);
			pluginSchema = {};
			for (const param of configSchema.config.fields) {
				const entries = Object.entries(param)[0];
				const key = entries[0];
				const value = entries[1];
				pluginSchema[key] = value;
				if (value.required) {
					config[key] = value.default ?? null;
				}
			}
			setEditField('config', config);
			console.log(res.data);
		}
	}
</script>

{#if entityKindToAdd}
	<div class="flex flex-col m-4">
		<div class="flex flex-row h-8">
			<Button on:click={async () => await save()} color="green">
				<FloppyDiskAltOutline class="m-2" />
				save {entityKindToAdd.substr(0, entityKindToAdd.length - 1)}
			</Button>
			<Button class="ml-3" on:click={format} color="blue">
				<PaletteOutline class="m-2" />
				format and validate JSON
			</Button>
			<Button class="ml-3" color="alternative">
				<a href="https://docs.konghq.com/gateway/3.7.x/admin-api/">
					<div class="flex flex-row items-center">
						<LinkOutline class="m-2" />
						Open Admin API Docs
					</div>
				</a>
			</Button>
		</div>
		{#if pluginSelect}
			<div class="my-2">
				<Label>
					Select a plugin to load schema
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

<textarea class="dark:bg-slate-900 w-full min-h-[30vh]" bind:value={json}></textarea>
<TreeWrapper data={testSchema} expandLevel={0} allowCopy={false} allowKeyCopy={true} />
{#if pluginSchema}
	<h2 class="m-4">Configuration parameters:</h2>
	<TreeWrapper data={pluginSchema} expandLevel={0} allowCopy={false} allowKeyCopy={true} />
{/if}
