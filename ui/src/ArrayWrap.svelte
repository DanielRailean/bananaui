<script lang="ts">
	import { onMount } from 'svelte';

	export let data: any[];
	export let displayedFields: string[] = [];
	export let itemPath:string
	export let pathField:string

	let copyText = 'copy';
	function writeToClipboard(text: string, self: any) {
		navigator.permissions.query({ name: 'clipboard-write' }).then((result) => {
			if (result.state === 'granted' || result.state === 'prompt') {
				navigator.clipboard.writeText(text).then(
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
		});
	}

	onMount(() => {
		console.log(data);
		if (!displayedFields || displayedFields.length == 0) {
			displayedFields = Object.keys(data[0]);
		}
	});
</script>

<div class="w-full">
	<table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
		<thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
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
				<tr>
					<!-- content here -->
					{#each displayedFields as field}
						<!-- content here -->
						{#if Object.keys(item).includes(field)}
							<!-- svelte-ignore a11y-click-events-have-key-events -->
							<td class="px-6 py-3">
								{item[field]}
								<button
									class="cursor-pointer text-green-500"
									on:click={() => {
										writeToClipboard(item[field], self);
									}}>{copyText}</button
								></td
							>
						{/if}
					{/each}
					<td><a href={itemPath.replace(pathField, item[pathField]) }>open</a></td>
				</tr>
			{:else}
				<p>empty list ...</p>
			{/each}
		</tbody>
	</table>
</div>
