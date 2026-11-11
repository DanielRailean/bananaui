<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { getGrandParent, getParentInfo } from '$lib/util';
	import { preferences } from '$lib/stores';

	export let field: string;
	export let id: string;

	let loadParentName = preferences?.loadParentInfo;
</script>

{#await getGrandParent(field, id) then gp}
	{#if gp}
		<a
			class="block px-1 text-xs text-[var(--text-tertiary)] hover:text-blue-600 truncate"
			title="go to {gp.field} ({gp.id})"
			href="{base}/entity?type={gp.field}s&id={gp.id}"
			on:click|preventDefault|stopPropagation={() => goto(`${base}/entity?type=${gp.field}s&id=${gp.id}`)}
		>
			↳ {gp.field}:
			{#if $loadParentName}
				{#await getParentInfo(gp.field, gp.id) then value}{value}{:catch}{gp.id}{/await}
			{:else}
				{gp.id}
			{/if}
		</a>
	{/if}
{/await}
