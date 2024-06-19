<script lang="ts">
	import { goto } from '$app/navigation';
	import { kongEntities } from '$lib/config';
	import { apiService } from '$lib/requests';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { Button } from 'flowbite-svelte';
	import { addToast } from '$lib/stores';

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
			const res = await apiService.createRecord(entityKindToAdd, JSON.parse(json));
			if (res.data.id) {
				goto(`/${entityKindToAdd}/${res.data.id}`);
			}
		} catch (error: any) {
			const err = error.response.data as any as Error;
			addToast({ message: err.message });
		}
	}
</script>

<div class="flex flex-col m-6">
	<div class="h-10">
		<h1>
			Admin API Docs

			<a href="https://docs.konghq.com/gateway/3.7.x/admin-api/">
				<Button class="ml-3" color="alternative">Open</Button>
			</a>
		</h1>
	</div>
	<div class="flex flex-row h-8 mt-10">
		<Button on:click={async () => await save()} color="green">save</Button>
	</div>
</div>

<textarea class="dark:bg-slate-900 w-full min-h-[70vh]" bind:value={json}></textarea>
