<script lang="ts">
	import { ArrowUpRightFromSquareOutline } from 'flowbite-svelte-icons';

	export let href: string = '';
	export let title: string = 'open';
	export let classes = '';
</script>

<button {title} class="btn-icon {classes}" color="alternative">
	<a {href} class="text-[var(--accent)]">
		<ArrowUpRightFromSquareOutline size="sm" />
	</a>
</button>
