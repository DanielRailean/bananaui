<script lang="ts">
	import TreeWrapper from './../../lib/components/treeWrapper.svelte';
	import { onMount } from 'svelte';
	import { config, userToken } from '$lib/stores';
	import { addToast, confirmToast, infoToast } from '$lib/toastStore';
	import { DateTime } from 'luxon';
	import { writeToClipboard } from '$lib/util';
	let info: any = {
		username: '',
		email: '',
		payload: {}
	};

	onMount(() => {
		const split = $userToken?.token.split('.');
		if (!split) {
			addToast({ message: 'no token!' });
			return;
		}
		const token_parsed = JSON.parse(atob(split[1]));
		info.payload = token_parsed;
		info.username = token_parsed.name;
		info.email = token_parsed.unique_name;
	});
</script>

<div>
	<!-- Profile card -->
	<div class="glass rounded-xl p-6 mb-6">
		<div class="flex items-center gap-4 mb-4">
			<div class="h-12 w-12 rounded-full bg-[var(--accent)]/20 flex items-center justify-center text-lg font-bold text-[var(--accent)]">
				{(info.username || info.email || '?').charAt(0).toUpperCase()}
			</div>
			<div>
				<h1 class="text-xl font-semibold">{info.username || 'Unknown user'}</h1>
				{#if info.email}
					<p class="text-sm text-[var(--text-secondary)]">{info.email}</p>
				{/if}
			</div>
		</div>
		<div class="flex items-center gap-2">
			<button
				class="btn-accent"
				disabled={$userToken?.expires == -1}
				on:click={() => {
					writeToClipboard($userToken?.token ?? '', '', () => {
						confirmToast(
							`copied! expires at ${DateTime.fromMillis(info.payload.exp * 1000).toFormat('T')}`
						);
					});
				}}
			>Copy API token</button>
			<button
				class="btn-ghost"
				disabled={$userToken?.expires != -1}
				on:click={() => {
					userToken.set(undefined);
					config.set($config);
				}}>Login again</button>
		</div>
	</div>

	<!-- Token details -->
	{#if info.payload && Object.keys(info.payload).length > 0}
		<h2 class="text-lg font-semibold mb-3">Token payload</h2>
		<div class="glass rounded-xl overflow-hidden">
			<TreeWrapper data={info.payload} expandLevel={1} />
		</div>
	{/if}
</div>
