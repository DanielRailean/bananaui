<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { tick } from 'svelte';

	export let value: any;
	export let editable = true;

	const dispatch = createEventDispatcher();

	let editing = false;
	let editValue = '';
	let inputEl: HTMLInputElement;

	function startEdit() {
		if (!editable) return;
		editing = true;
		editValue = typeof value === 'string' ? value : JSON.stringify(value);
		tick().then(() => {
			inputEl?.focus();
			inputEl?.select();
		});
	}

	function save() {
		editing = false;
		let parsed: any;
		try {
			parsed = JSON.parse(editValue);
		} catch {
			parsed = editValue;
		}
		if (JSON.stringify(parsed) !== JSON.stringify(value)) {
			dispatch('save', { value: parsed });
		}
	}

	function cancel() {
		editing = false;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			e.preventDefault();
			save();
		} else if (e.key === 'Escape') {
			e.preventDefault();
			cancel();
		}
	}
</script>

{#if editing}
	<input
		bind:this={inputEl}
		bind:value={editValue}
		class="inline-edit-input"
		on:blur={save}
		on:keydown={handleKeydown}
		spellcheck="false"
	/>
{:else}
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<span
		class="{editable ? 'cursor-pointer hover:bg-[var(--accent)]/[0.06] rounded px-1 -mx-1' : ''}"
		on:dblclick={startEdit}
		title={editable ? 'Double-click to edit' : undefined}
	>
		<slot />
	</span>
{/if}

<style>
	.inline-edit-input {
		background: var(--glass-bg);
		border: 1px solid var(--accent);
		border-radius: 0.5rem;
		padding: 2px 8px;
		font-size: inherit;
		font-family: inherit;
		color: var(--text-primary);
		outline: none;
		min-width: 100px;
		width: 100%;
		max-width: 400px;
	}
</style>
