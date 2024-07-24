<script>
	import { Toast } from 'flowbite-svelte';
	import {
		CheckCircleOutline,
		CloseCircleSolid,
		CloseOutline,
		ExclamationCircleOutline,
		InfoCircleOutline
	} from 'flowbite-svelte-icons';
	import { createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';

	const dispatch = createEventDispatcher();

	export let type = 'error';
	export let dismissible = true;
</script>

<article
	class="dark:bg-[#1E2021] bg-gray-200 max-w-[35rem] flex my-1 p-2 px-4 rounded items-center dark:border-stone-700 shadow"
	role="alert"
	transition:fade
>
	<div class="text-white">
		{#if type === 'success'}
			<!-- <SuccessIcon width="1.1em" /> -->
			<CheckCircleOutline class="w-10 h-10 fill-green-700" />
		{:else if type === 'error'}
			<ExclamationCircleOutline class="w-10 h-10 fill-red-700" />
		{:else}
			<InfoCircleOutline class="w-10 h-10 fill-blue-700" />
		{/if}
	</div>

	<div class="mx-2 w-full">
		<slot />
	</div>

	{#if dismissible}
		<button class="self-start" on:click={() => dispatch('dismiss')}>
			<CloseOutline></CloseOutline>
		</button>
	{/if}
</article>
