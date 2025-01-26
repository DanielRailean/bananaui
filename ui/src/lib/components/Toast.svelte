<script lang="ts">
	import { Toast } from 'flowbite-svelte';
	import {
		CheckCircleOutline,
		CheckCircleSolid,
		CloseCircleSolid,
		CloseOutline,
		ExclamationCircleOutline,
		ExclamationCircleSolid,
		InfoCircleOutline,
		InfoCircleSolid
	} from 'flowbite-svelte-icons';
	import { createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';

	const dispatch = createEventDispatcher();

	export let type = 'error';
	export let dismissible = true;
</script>

<article
	class="dark:bg-[#1E2021] bg-gray-200 max-w-[35rem] flex my-1 p-1 px-2 rounded items-center dark:border-stone-700 shadow dark:shadow-gray-900"
	role="alert"
	transition:fade
>
	<div class="text-white">
		{#if type === 'success'}
			<CheckCircleSolid class="w-8 h-8 fill-green-500 dark:fill-green-700" />
		{:else if type === 'error'}
			<InfoCircleSolid class="w-8 h-8 fill-blue-600" />
		{:else}
			<ExclamationCircleSolid class="w-8 h-8 fill-rose-500 " />
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
