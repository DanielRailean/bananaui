<script lang="ts">
	import { writeToClipboard } from '$lib/util';
	import { goto } from '$app/navigation';
	import { Button } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { 
		FileCopyOutline } from 'flowbite-svelte-icons';


	export let data: any[];
	export let displayedFields: any;
	export let itemPath: string;
	export let pathField: string;
	export let kind: string

	let copyText = 'copy';
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
	<div class="flex flex-row m-4 h-8">
		<Button color="alternative" on:click={()=>{goto(`/add/${kind}`)}}>Add</Button>
	</div>
	<table class="w-full text-sm text-left rtl:text-right text-slate-800 dark:text-slate-400">
		<thead
			class="text-xs text-slate-800 uppercase dark:bg-gray-800 bg-gray-200 dark:text-slate-400"
		>
			<tr>
				<th>copy</th>
				{#each displayedFields as field}
					<!-- content here -->
					{#if Object.keys(data[0]).includes(field)}
						<th scope="col" class="px-6 py-3"> {field} </th>
					{/if}
				{/each}
				<th>link</th>
			</tr>
		</thead>
		<tbody>
			{#each data as item}
			<tr class="even:dark:bg-slate-800 even:bg-slate-200">
				<div class="h-full w-full cursor-pointer" on:click={()=>writeToClipboard(JSON.stringify(item, undefined, 2))}>
					<FileCopyOutline class="m-2"/>
				</div>
					<!-- content here -->
					{#each displayedFields as field}
						<!-- content here -->
						{#if Object.keys(item).includes(field)}
							<!-- svelte-ignore a11y-click-events-have-key-events -->
							<td class="px-6 py-3">
								{JSON.stringify(item[field], undefined, 2)}
								<button
									class="cursor-pointer text-green-500"
									on:click={() => {
										copy(item[field]);
									}}>{copyText}</button
								></td
							>
						{/if}
					{/each}
					<td
						><a href={itemPath.replace(pathField, item[pathField])} class="text-emerald-600">view</a
						></td
					>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
