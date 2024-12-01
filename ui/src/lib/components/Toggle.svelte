<script lang="ts">
	import { createSwitch, melt } from '@melt-ui/svelte';
	import { createEventDispatcher, onMount } from 'svelte';

	const handleChange = ({ curr, next }) => {
		// console.log(curr);
		// console.log(next);
    dispatch("change" , next)
		return next;
	};

  export let isChecked: boolean = false

	let {
		elements: { root, input }
	} = createSwitch({
		onCheckedChange: handleChange,
    defaultChecked: isChecked
	});

	const dispatch = createEventDispatcher();
  onMount(() => {
    
  })
</script>

<form class="">
	<div class="flex items-center cursor-pointer">
		<button
			use:melt={$root}
			class="relative h-6 rounded-full bg-stone-600 transition-colors data-[state=checked]:bg-stone-900"
			id="airplane-mode"
			aria-labelledby="airplane-mode-label"
		>
			<span class="thumb block rounded-full bg-white transition" />
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
