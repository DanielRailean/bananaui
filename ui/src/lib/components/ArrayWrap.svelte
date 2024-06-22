<script lang="ts">
	import { writeToClipboard } from '$lib/util';
	import { goto } from '$app/navigation';
	import { Button } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { CirclePlusOutline, FileCopyOutline, LinkOutline } from 'flowbite-svelte-icons';

	export let data: any[];
	export let displayedFields: any;
	export let itemPath: string;
	export let pathField: string;
	export let kind: string;

	function copy(data: any) {
		let result = JSON.stringify(data, undefined, 2);
		if (typeof data == 'string') {
			result = data;
		}
		writeToClipboard(result);
	}

	onMount(() => {
		// console.log(data);
		if (!displayedFields || displayedFields.length == 0) {
			displayedFields = Object.keys(data[0]);
		}
	});
</script>

<div class="w-full">
	<table class="w-full text-sm text-left rtl:text-right text-slate-800 dark:text-slate-400">
		<thead
			class="text-xs text-slate-800 uppercase dark:bg-gray-800 bg-gray-200 dark:text-slate-400"
		>
			<tr>
				<th><p class="pl-4">Actions</p></th>
				{#each displayedFields as field}
					<!-- content here -->
					{#if Object.keys(data[0]).includes(field)}
						<th scope="col" class="px-6 py-3"> {field} </th>
					{/if}
				{/each}
				<th>
					<p class="pr-6">&lt</p>
				</th>
			</tr>
		</thead>
		<tbody>
			{#each data as item}
				<tr class="even:dark:bg-slate-800 even:bg-slate-200">
					<td class="px-6 py-3">
						<Button
							class="h-8 p-2"
							color="alternative"
							on:click={() => {
								copy(JSON.stringify(item));
							}}
						>
							<div class="flex flex-row items-center">
								<FileCopyOutline class="m-1" />
								json
							</div>
						</Button>
						<Button class="h-8 p-2" color="alternative">
							<a href={itemPath.replace(pathField, item[pathField])} class="text-emerald-600">
								<div class="flex flex-row items-center">
									<LinkOutline class="m-1" />
									link
								</div>
							</a>
						</Button>
					</td>
					<!-- content here -->
					{#each displayedFields as field}
						<!-- content here -->
						{#if Object.keys(item).includes(field)}
							<!-- svelte-ignore a11y-click-events-have-key-events -->
							<td class="px-6 py-3">
								<div class="flex flex-row items-center justify-between">
									<p
										class="mr-2 cursor-pointer"
										title="click to copy"
										on:click={() => {
											copy(item[field]);
										}}
									>
										{JSON.stringify(item[field], undefined, 2)}
									</p>
								</div></td
							>
						{/if}
					{/each}
					<td></td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
