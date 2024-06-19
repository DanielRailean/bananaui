<script lang="ts">
	import EntityPage from '../../../lib/components/entityPage.svelte';
	import type { GetAllServices, Error } from '$lib/responseTypes.ts';
	import { apiService } from '$lib/requests';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	let info: GetAllServices;
	let id = $page.params.slug;

	let entity: string;

	page.subscribe((val) => {
		entity = val.url.pathname.split('/')[1];
	});

	onMount(async () => {
		entity = $page.url.pathname.split('/')[1];
		const res = await apiService.findRecord(entity, id);
		info = res.data as GetAllServices;
		json = JSON.stringify(info, undefined, 2);
	});

	let json = '';
</script>

{#if info}
	<EntityPage {json} {id} {entity} />
{/if}
