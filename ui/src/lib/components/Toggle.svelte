<script lang="ts">
	import { createSwitch, melt, type CreateDialogProps } from '@melt-ui/svelte';
	import { createEventDispatcher, onMount } from 'svelte';
	import { writable, type Writable } from 'svelte/store';

	const handleChange: CreateDialogProps['onOpenChange'] = ({ curr, next }) => {
		// todo next still set if not confirmed
    dispatch("change" , next)
		return next;
	};

  export let isChecked: Writable<boolean> = writable(false)
	export let title: string | undefined = undefined

	let {
		elements: { root, input }
	} = createSwitch({
		onCheckedChange: handleChange,
    checked: isChecked
	});

	const dispatch = createEventDispatcher();
  onMount(() => {
    
  })
</script>

<form class="" title="{title ?? `click to ${$isChecked ? "disable" : "enable"}`}">
	<div class="flex items-center cursor-pointer ">
		<button
			use:melt={$root}
			class="relative h-6 rounded-full bg-slate-300 dark:bg-slate-600 transition-colors data-[state=checked]:dark:bg-emerald-800 data-[state=checked]:bg-emerald-500"
			id="airplane-mode"
			aria-labelledby="airplane-mode-label"
		>
			<span class="thumb block rounded-full dark:bg-slate-900 bg-white transition" />
		</button>
		<input use:melt={$input} />
	</div>
</form>

<style>
	button {
		--w: 2.75rem;
		--padding: 0.125rem;
		width: var(--w);
	}

	.thumb {
		--size: 1.25rem;
		width: var(--size);
		height: var(--size);
		transform: translateX(var(--padding));
	}

	:global([data-state='checked']) .thumb {
		transform: translateX(calc(var(--w) - var(--size) - var(--padding)));
	}
</style>
