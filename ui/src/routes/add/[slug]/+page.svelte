<script lang="ts">
	import type { IResCreateError } from '$lib/responseTypes';
	import type { IEntityBase } from '$lib/types';
	import type { ResWrapped } from '$lib/requests';
	import { goto } from '$app/navigation';
	import { kongEntities } from '$lib/config';
	import { apiService } from '$lib/requests';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { Button } from 'flowbite-svelte';
	import { addToast } from '$lib/stores';
	import { FloppyDiskAltOutline, LinkOutline, PaletteOutline } from 'flowbite-svelte-icons';

	let entityKindToAdd = $page.params.slug;

	let json = '';
	let postPath: string | undefined;
	onMount(async () => {
		let path = $page.url.searchParams.get('apiPostPath');
		if (path) {
			postPath = atob(path);
		}

		const found = kongEntities.find((i) => i.name == entityKindToAdd);
		if (found) {
			const dummy: any = {};
			for (const keys of found.displayedFields) {
				dummy[keys] = null;
			}
			json = JSON.stringify(dummy, undefined, 2);
		}
	});

	function format() {
		let parsed: any | undefined
		try{
			parsed = JSON.parse(json)
		} catch (err: any) {
			addToast({message: `Failed to parse JSON. ${err.message}`})
			return
		}
		json = JSON.stringify(parsed, undefined, 2)
	}

	async function save() {
		try {
			let res: ResWrapped<IEntityBase, IResCreateError> | undefined;

			if (postPath) {
				res = await (await apiService()).request<IEntityBase, IResCreateError>(postPath, "POST" , JSON.parse(json));
			} else {
				res = await (await apiService()).createRecord(entityKindToAdd, JSON.parse(json));
			}
			if (!res.ok || !res.data) {
				addToast({ message: res.errTyped?.message ?? res.err ?? 'Error occured' });
				return;
			}
			if (res.data.id) {
				goto(`/${entityKindToAdd}/${res.data.id}`);
			}
		} catch (error: any) {
			const err = error.response.data as any as Error;
			addToast({ message: err.message });
		}
	}
</script>

<div class="flex flex-col m-4">
	<div class="flex flex-row h-8">
		<Button on:click={async () => await save()} color="green">
			<FloppyDiskAltOutline class="m-2" />
			save {entityKindToAdd.substr(0, entityKindToAdd.length - 1)}
		</Button>
		<Button  class="ml-3" on:click={format} color="blue">
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
</div>

<textarea class="dark:bg-slate-900 w-full min-h-[70vh]" bind:value={json}></textarea>
