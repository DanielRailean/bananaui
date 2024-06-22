<script lang="ts">
	import { goto } from '$app/navigation';
	import { kongEntities } from '$lib/config';
	import { apiService } from '$lib/requests';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { Button } from 'flowbite-svelte';
	import { addToast } from '$lib/stores';
	import { FloppyDiskAltOutline, LinkOutline } from 'flowbite-svelte-icons';

	let entityKindToAdd = $page.params.slug;

	let json = '';
	onMount(async () => {
		const found = kongEntities.find((i) => i.name == entityKindToAdd);
		if (found) {
			const dummy: any = {};
			for (const keys of found.displayedFields) {
				dummy[keys] = null;
			}
			json = JSON.stringify(dummy, undefined, 2);
		}
	});

	async function save() {
		try {
			const res = await (await apiService()).createRecord(entityKindToAdd, JSON.parse(json));
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
