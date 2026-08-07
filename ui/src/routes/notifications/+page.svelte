<script lang="ts">
	import TreeWrapper from './../../lib/components/treeWrapper.svelte';
	import { toastList, clearToasts } from '$lib/toastStore';
	import { confirm } from '$lib/confirmStore';
	import { onMount } from 'svelte';
	import { TrashBinOutline } from 'flowbite-svelte-icons';

	let localToasts: any[] = [];
	function loadToasts() {
		localToasts = toastList.reverse().map((item) => {
			return { message: item.message, type: item.type, timestamp: item.timestamp };
		});
	}
	onMount(() => {
		loadToasts();
	});
</script>

<div class="w-full p-4">
	<h1 class="pb-4 pl-2 text-xl">Notifications list</h1>
	<button
		title="sort entities now"
		on:click={async () => {
			const ok = await confirm({
				title: 'Clear notifications',
				message: `Delete all ${localToasts.length} notifications?`,
				variant: 'danger',
				confirmText: 'Delete all'
			});
			if (!ok) return;
			clearToasts();
			loadToasts();
		}}
		class="flex flex-row items-center dark:bg-rose-900 bg-rose-100 shadow shadow-stone-400 dark:shadow-stone-900 rounded p-1 pr-2 m-1"
	>
		<TrashBinOutline class="m-1" />
		Delete all
	</button>
	<TreeWrapper
		expandLevel={1}
		data={{
			errors: localToasts
				.filter((i) => i.type == 'error')
				.map((i) => i.message + ' (' + new Date(i.timestamp).toLocaleString() + ')'),
			info: localToasts
				.filter((i) => i.type == 'info')
				.map((i) => i.message + ' (' + new Date(i.timestamp).toLocaleString() + ')'),
			success: localToasts
				.filter((i) => i.type == 'success')
				.map((i) => i.message + ' (' + new Date(i.timestamp).toLocaleString() + ')')
		}}
	/>
</div>
