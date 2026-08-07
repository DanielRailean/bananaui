<script lang="ts">
	export let id: string;
	export let level: 'h2' | 'h3' = 'h3';

	function copyAnchorLink() {
		const url = new URL(window.location.href);
		url.hash = id;
		history.replaceState(null, '', url.toString());
		navigator.clipboard.writeText(url.toString());
	}
</script>

<svelte:element this={level} {id} class="{level === 'h2' ? 'text-2xl mb-3 dark:text-zinc-300' : 'text-lg mb-2 dark:text-zinc-400'} group">
	<a href="#{id}" on:click|preventDefault={copyAnchorLink} class="hover:underline">
		<slot /><span class="opacity-0 group-hover:opacity-50 ml-2 text-sm">#</span>
	</a>
</svelte:element>
