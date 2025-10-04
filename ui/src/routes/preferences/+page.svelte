<script lang="ts">
	import { goto } from '$app/navigation';
	import { LOCALSTORAGE_CONFIG_KEY, delay } from '$lib/util';
	import { PaletteOutline, FloppyDiskAltOutline, LinkOutline } from 'flowbite-svelte-icons';
	import { addToast, infoToast } from '$lib/toastStore';
	import { Button } from 'flowbite-svelte';
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

<div class="flex flex-col m-2">
	<div class="flex flex-row flex-wrap">
		<Button class="h-10 m-1" on:click={async () => save()} color="green">
			<FloppyDiskAltOutline class="m-2" />
			save
		</Button>
		<Button class="h-10 m-1" on:click={() => format()} color="blue">
			<PaletteOutline class="m-2" />
			format and validate JSON
		</Button>
	</div>
</div>
<div class="dark:border-stone-700">
	<div class="editor dark:bg-[#1E2021] w-full min-h-[30vh] line-numbers">
		<pre class="language-json"><code bind:this={editorSyntax}></code></pre>
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

	code,
	pre {
		@apply dark:bg-zinc-900 bg-stone-800;
	}
</style>
