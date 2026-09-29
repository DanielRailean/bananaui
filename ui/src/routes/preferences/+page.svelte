<script lang="ts">
	import { goto } from '$app/navigation';
	import { PaletteOutline, FloppyDiskAltOutline } from 'flowbite-svelte-icons';
	import { addToast, infoToast } from '$lib/toastStore';
	import type { IConfig } from '$lib/types.ts';
	import { onMount } from 'svelte';
	import { base } from '$app/paths';
	import { config, getPreferencesAsJson, getPreferencesObject, savePreferences, setPreferences } from '$lib/stores';

	let json = '';
	onMount(async () => {
		json = getPreferencesAsJson();
		triggerHighlight();
	});

	function format(confirmOk = true) {
		let parsed: any | undefined;
		try {
			parsed = JSON.parse(json);
		} catch (err: any) {
			addToast({ message: `Failed to parse JSON. ${err.message}` });
			return;
		}
		json = JSON.stringify(parsed, undefined, 2);
		triggerHighlight();
		if (confirmOk) {
			addToast({ message: `json valid!`, type: 'info' });
		}
	}

	let editorWindow: HTMLTextAreaElement;
	let editorSyntax: HTMLElement;

	async function triggerHighlight() {
		json = json.replace(/\t/g, '  ');
		editorSyntax.textContent = json;

		// Highlight the syntax
		(globalThis as any).Prism.highlightElement(editorSyntax);
	}

	function save()
	{
		format(false)
		setPreferences(getPreferencesObject(JSON.parse(json)));
		savePreferences()
		infoToast("preferences saved!")
	}
</script>

<div class="flex flex-col">
	<div class="flex items-center justify-between mb-4">
		<div>
			<h1 class="text-2xl font-semibold">Preferences</h1>
			<p class="text-sm text-[var(--text-secondary)]">Edit app preferences as JSON. Saved in browser storage.</p>
		</div>
		<div class="flex items-center gap-2">
			<button class="btn-accent" on:click={() => format()}>
				<PaletteOutline size="sm" />
				Format
			</button>
			<button class="btn-success" on:click={async () => save()}>
				<FloppyDiskAltOutline size="sm" />
				Save
			</button>
		</div>
	</div>
</div>
<div class="dark:border-stone-700">
	<div class="editor dark:bg-[#1E2021] w-full min-h-[30vh] line-numbers">
		<pre class="language-json dark:bg-zinc-900"><code class="dark:bg-zinc-900" bind:this={editorSyntax}></code></pre>
		<textarea
			bind:this={editorWindow}
			spellcheck="false"
			wrap="hard"
			autocorrect="off"
			autocapitalize="off"
			translate="no"
			class="relative"
			bind:value={json}
			on:input={() => {
				triggerHighlight();
			}}
		></textarea>
	</div>
</div>

<style>
	.editor {
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: 1fr;
		gap: 0;
	}

	.editor pre,
	.editor textarea {
		grid-area: 1 / 1 / 2 / 2;
	}

	.editor textarea {
		background-color: transparent;
		border: none;
		color: transparent;
		caret-color: gray;
		overflow: hidden;
		resize: none;
		width: 100%;
	}

	textarea,
	pre {
		padding: 0;
		margin: 0;
	}

	textarea,
	pre,
	code {
		outline: none;
		border: none;
		box-shadow: none;
		font-family: 'JetBrains Mono', monospace;
		font-size: 20px;
		line-height: 30px;
		border-radius: 0;
		white-space: break-spaces;
	}

	textarea,
	pre {
		padding: 10px;
		padding-left: 75px;
	}

</style>
