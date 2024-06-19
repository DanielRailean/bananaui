<script lang="ts">
	import { onMount } from 'svelte';

	export let data: any[];
	export let displayedFields: any;
	export let itemPath: string;
	export let pathField: string;

	let copyText = 'copy';
	function writeToClipboard(data: any) {
		let result = JSON.stringify(data, undefined, 2);
		if (typeof data == 'string') {
			result = data;
		}
		navigator.clipboard.writeText(result).then(
			() => {
				copyText = 'ok';
				setTimeout(() => {
					copyText = 'copy';
				}, 500);
			},
			() => {
				/* clipboard write failed */
			}
		);
	}

	onMount(() => {
		// console.log(data);
		if (!displayedFields || displayedFields.length == 0) {
			displayedFields = Object.keys(data[0]);
		}
	});
</script>

<div class="w-full h-[100vh]">
	<table class="w-full text-sm text-left rtl:text-right text-slate-800 dark:text-slate-400">
		<thead
			class="text-xs text-slate-800 uppercase dark:bg-gray-800 bg-gray-200 dark:text-slate-400"
		>
			<tr>
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
										writeToClipboard(item[field]);
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
