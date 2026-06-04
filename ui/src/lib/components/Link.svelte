<script lang="ts">
	import { ArrowUpRightFromSquareOutline } from 'flowbite-svelte-icons';

	export let href: string = '';
	export let title: string = 'open';
	export let classes = '';
</script>

<button {title} class="h-8 {classes}" color="alternative">
	<a {href} class="dark:text-emerald-600 text-emerald-400">
		<div class="flex flex-row items-center rounded hover:outline outline-1 hover:outline-stone-700">
			<ArrowUpRightFromSquareOutline class="m-1" size="lg" />
		</div>
	</a>
</button>
