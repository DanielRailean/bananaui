<script lang="ts">
	import { confirmState } from '$lib/confirmStore';
	import { ExclamationCircleSolid } from 'flowbite-svelte-icons';
	import { fade, scale } from 'svelte/transition';

	let dialogEl: HTMLDivElement;

	function respond(value: boolean) {
		if ($confirmState.resolve) {
			$confirmState.resolve(value);
		}
		confirmState.update((s) => ({ ...s, open: false, resolve: null }));
	}

	function handleKeydown(e: KeyboardEvent) {
		if (!$confirmState.open) return;
		if (e.key === 'Escape') respond(false);
	}

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) respond(false);
	}

	$: variantColors = {
		danger: {
			icon: 'fill-rose-500',
			btn: 'bg-rose-600 hover:bg-rose-700 focus:ring-rose-500'
		},
		warning: {
			icon: 'fill-amber-500',
			btn: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500'
		},
		info: {
			icon: 'fill-blue-500 dark:fill-blue-400',
			btn: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
		}
	}[$confirmState.variant];

	$: if ($confirmState.open && dialogEl) {
		const btn = dialogEl.querySelector<HTMLButtonElement>('[data-confirm-cancel]');
		btn?.focus();
	}
</script>

<svelte:window on:keydown={handleKeydown} />

{#if $confirmState.open}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div
		class="fixed inset-0 z-[1100] flex items-center justify-center bg-black/50 backdrop-blur-sm"
		transition:fade={{ duration: 150 }}
		on:click={handleBackdropClick}
		role="dialog"
		aria-modal="true"
		aria-labelledby="confirm-title"
		aria-describedby="confirm-message"
	>
		<div
			bind:this={dialogEl}
			class="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl dark:bg-[#1E2021] dark:border dark:border-stone-700"
			transition:scale={{ duration: 150, start: 0.95 }}
			on:click|stopPropagation
		>
			<div class="flex items-start gap-4">
				<div class="shrink-0 mt-0.5">
					<ExclamationCircleSolid class="w-7 h-7 {variantColors.icon}" />
				</div>
				<div class="flex-1 min-w-0">
					<h3 id="confirm-title" class="text-lg font-semibold text-gray-900 dark:text-stone-50">
						{$confirmState.title}
					</h3>
					<p id="confirm-message" class="mt-2 text-sm text-gray-600 dark:text-stone-400">
						{$confirmState.message}
					</p>
				</div>
			</div>

			<div class="mt-6 flex justify-end gap-3">
				<button
					data-confirm-cancel
					class="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:bg-stone-700 dark:text-stone-200 dark:hover:bg-stone-600 dark:focus:ring-stone-500"
					on:click={() => respond(false)}
				>
					{$confirmState.cancelText}
				</button>
				<button
					class="rounded-lg px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-[#1E2021] {variantColors.btn}"
					on:click={() => respond(true)}
				>
					{$confirmState.confirmText}
				</button>
			</div>
		</div>
	</div>
{/if}
