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
			icon: 'fill-[var(--danger)]',
			btn: 'btn-danger'
		},
		warning: {
			icon: 'fill-[var(--warning)]',
			btn: 'btn-accent'
		},
		info: {
			icon: 'fill-[var(--accent)]',
			btn: 'btn-accent'
		}
	}[$confirmState.variant];

	$: if ($confirmState.open && dialogEl) {
		const btn = dialogEl.querySelector<HTMLButtonElement>('[data-confirm-cancel]');
		btn?.focus();
	}

	const MAX_MESSAGE_LENGTH = 500;
	$: displayMessage = $confirmState.message.length > MAX_MESSAGE_LENGTH
		? $confirmState.message.slice(0, MAX_MESSAGE_LENGTH) + '…'
		: $confirmState.message;
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
			class="w-full max-h-[80vh] flex flex-col rounded-2xl p-6 glass {$confirmState.changes.length > 0 ? 'max-w-lg' : 'max-w-md'}"
			transition:scale={{ duration: 150, start: 0.97 }}
			on:click|stopPropagation
		>
			<div class="flex items-start gap-3">
				<div class="shrink-0 mt-0.5">
					<ExclamationCircleSolid class="w-6 h-6 {variantColors.icon}" />
				</div>
				<div class="flex-1 min-w-0">
					<h3 id="confirm-title" class="text-base font-semibold">
						{$confirmState.title}
					</h3>
					<p id="confirm-message" class="mt-1.5 text-[13px] text-[var(--text-secondary)] whitespace-pre-wrap break-words">
						{displayMessage}
					</p>
				</div>
			</div>
			{#if $confirmState.changes.length > 0}
				<div class="mt-3 max-h-[40vh] overflow-auto rounded-lg border border-[var(--glass-border)]">
					<table class="w-full text-xs">
						<thead class="sticky top-0 bg-[var(--bg-secondary)] z-10">
							<tr class="text-left text-[var(--text-tertiary)] border-b border-[var(--glass-border)]">
								<th class="px-3 py-2 font-medium">Field</th>
								<th class="px-3 py-2 font-medium">Old</th>
								<th class="px-3 py-2 font-medium">New</th>
							</tr>
						</thead>
						<tbody>
							{#each $confirmState.changes as change, i}
								<tr class="{i > 0 ? 'border-t border-[var(--glass-border)]' : ''}">
									<td class="px-3 py-2 font-mono font-medium text-[var(--text-primary)] whitespace-nowrap">{change.field}</td>
									<td class="px-3 py-2 font-mono text-red-600 dark:text-red-400 bg-red-500/5 break-all">{change.oldValue}</td>
									<td class="px-3 py-2 font-mono text-green-600 dark:text-green-400 bg-green-500/5 break-all">{change.newValue}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}

			<div class="mt-6 flex justify-end gap-2">
				<button
					data-confirm-cancel
					class="btn-ghost"
					on:click={() => respond(false)}
				>
					{$confirmState.cancelText}
				</button>
				<button
					class="btn {variantColors.btn}"
					on:click={() => respond(true)}
				>
					{$confirmState.confirmText}
				</button>
			</div>
		</div>
	</div>
{/if}
