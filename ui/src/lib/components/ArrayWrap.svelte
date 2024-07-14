<script lang="ts">
	import { writeToClipboard } from '$lib/util';
	import { goto } from '$app/navigation';
	import { Button } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { DateTime } from 'luxon';
	import { FileCopyOutline, LinkOutline, TrashBinOutline } from 'flowbite-svelte-icons';
	import { dateFields, kongEntities } from '$lib/config';
	import { apiService } from '$lib/requests';
	import { addToast } from '$lib/stores';
	import { createEventDispatcher } from 'svelte';
	import type { IKongEntity } from '$lib/types';
	import { base } from '$app/paths';

	const dispatch = createEventDispatcher();

	export let data: any[];
	export let displayedFields: any;
	export let type: string;
	export let entity: IKongEntity | undefined = undefined;

	let searchText = '';
	let filteredData: any[];

	function copy(data: any) {
		let result = JSON.stringify(data, undefined, 2);
		if (typeof data == 'string') {
			result = data;
		}
		writeToClipboard(result);
	}

	onMount(() => {
		if (!displayedFields || displayedFields.length == 0) {
			displayedFields = Object.keys(data[0]);
		}
		filteredData = data.sort((a, b) => {
			if (entity && entity.sortBy) {
				const sortKey = entity.sortBy;
				if (entity.sortAscending === true) {
					return (a[sortKey] - b[sortKey]) as number;
				} else {
					return (b[sortKey] - a[sortKey]) as number;
				}
			}
			return b.updated_at - a.updated_at;
		});
	});

	function search() {
		if (searchText.length == 0) {
			filteredData = data;
		}
		filteredData = data.filter((item) =>
			JSON.stringify(Object.values(item)).toLowerCase().includes(searchText.toLowerCase())
		);
	}
	async function deleteEntity(type: string, id: string, name: string) {
		const conf = confirm(`Please confirm deletion of '${name}'`);
		if (!conf) {
			return;
		}
		const res = await (await apiService()).deleteRecord(type, id);
		if (!res.ok) {
			addToast({ message: `failed to delete. ${res.err}` });
		} else {
			addToast({ message: `ok`, type: `info` });
		}
		dispatch('refresh');
	}
</script>

<div class="w-full">
	<div class="flex flex-row m-4 h-8">
		<input
			class="bg-transparent rounded-lg dark:border-slate-700 border-slate-300"
			type="text"
			bind:value={searchText}
			on:input={search}
			placeholder="search any field"
		/>
	</div>
	<table class="w-full text-sm text-left rtl:text-right text-slate-800 dark:text-slate-400">
		<thead
			class="text-xs text-slate-800 uppercase dark:bg-gray-800 bg-gray-200 dark:text-slate-400"
		>
			<tr>
				<th><p class="pl-4">Actions</p></th>
				{#each displayedFields as field}
					{#if Object.keys(data[0]).includes(field)}
						<th scope="col" class="py-3"> {field} </th>
					{/if}
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each searchText.length > 0 ? filteredData : data as item}
				<tr class="border-t dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-900">
					<td class="py-3">
						<div class="ml-4">
							<Button
								class="h-8 p-2"
								title="copy as json"
								color="alternative"
								on:click={() => {
									copy(JSON.stringify(item));
								}}
							>
								<div class="flex flex-row items-center">
									<FileCopyOutline class="m-1" />
								</div>
							</Button>
							<Button title="open" class="h-8 p-2" color="alternative">
								<a href="{base}/entity?type={type}&id={item.id}" class="text-emerald-600">
									<div class="flex flex-row items-center">
										<LinkOutline class="m-1" />
									</div>
								</a>
							</Button>
							<Button
								class="h-8 p-2"
								title="delete"
								color="alternative"
								on:click={async () =>
									await deleteEntity(entity?.name ?? '', item.id, item.name ?? item.id)}
							>
								<div class="text-rose-500">
									<div class="flex flex-row items-center">
										<TrashBinOutline class="m-1" />
									</div>
								</div>
							</Button>
						</div>
					</td>

					{#each displayedFields as field}
						{#if Object.keys(item).includes(field)}
							<td class="py-3">
								<div class="flex flex-row items-center justify-between">
									<!-- svelte-ignore a11y-click-events-have-key-events -->
									<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
									<p
										class="mr-2 cursor-pointer"
										title="click to copy"
										on:click|stopPropagation={() => {
											copy(item[field]);
										}}
									>
										{#if typeof item[field] == 'string'}
											{item[field]}
										{:else if typeof item[field] == 'number'}
											{#if dateFields.includes(field)}
												{DateTime.fromSeconds(item[field]).toLocaleString({
													...DateTime.DATETIME_MED,
													weekday: 'short'
												})}
											{:else}
												{item[field]}
											{/if}
										{:else if item[field] && Object.keys(item[field]).includes('id') && kongEntities.find((i) => i.apiPath == `${field}s`)}
											<!-- svelte-ignore a11y-no-static-element-interactions -->
											<a
												on:click|preventDefault={() =>
													goto(`${base}/entity?type=${field}s&id=${item[field].id}`)}
												title="open {field}"
												href="{base}/entity?type={field}s&id={item[field].id}"
											>
												<div>
													<p class="dark:text-blue-500 text-blue-700">{item[field].id}</p>
												</div>
											</a>
										{:else}
											{JSON.stringify(item[field], undefined, 2)}
										{/if}
									</p>
								</div></td
							>
						{/if}
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</div>
