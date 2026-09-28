<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { config, preferences } from '$lib/stores';
	import { get } from 'svelte/store';
	import { capitalizeFirstLetter } from '$lib/util';
	import { fade, scale } from 'svelte/transition';
	import { onMount, tick } from 'svelte';

	let open = false;
	let query = '';
	let inputEl: HTMLInputElement;

	interface PaletteItem {
		label: string;
		sublabel?: string;
		href: string;
		type: 'page' | 'entity';
		shortcut?: string;
	}

	const pages: PaletteItem[] = [
		{ label: 'Home', href: `${base}/`, type: 'page', shortcut: 'g h' },
		{ label: 'Reference', href: `${base}/reference`, type: 'page', shortcut: 'g f' },
		{ label: 'Notifications', href: `${base}/notifications`, type: 'page', shortcut: 'g n' },
		{ label: 'Preferences', href: `${base}/preferences`, type: 'page', shortcut: 'g ,' },
		{ label: 'Profile', href: `${base}/profile`, type: 'page', shortcut: 'g u' },
	];

	let allItems: PaletteItem[] = [...pages];
	let filtered: PaletteItem[] = allItems;
	let selectedIndex = 0;

	function updateFiltered() {
		if (query.length === 0) {
			filtered = allItems;
		} else {
			const q = query.toLowerCase();
			filtered = allItems.filter((item) =>
				item.label.toLowerCase().includes(q) ||
				(item.sublabel?.toLowerCase().includes(q) ?? false)
			);
		}
		if (selectedIndex >= filtered.length) {
			selectedIndex = Math.max(filtered.length - 1, 0);
		}
	}

	function moveSelection(delta: number) {
		if (filtered.length === 0) return;
		selectedIndex = ((selectedIndex + delta) % filtered.length + filtered.length) % filtered.length;
		filtered = filtered;
	}

	function assignShortcuts(entities: PaletteItem[]): PaletteItem[] {
		const usedKeys = new Set(pages.map(p => p.shortcut?.split(' ')[1]));
		return entities.map(e => {
			let key = '';
			const name = e.label.toLowerCase();
			for (const ch of name) {
				if (!usedKeys.has(ch) && ch.match(/[a-z]/)) {
					key = ch;
					break;
				}
			}
			if (key) {
				usedKeys.add(key);
				return { ...e, shortcut: `g ${key}` };
			}
			return e;
		});
	}

	let gPending = false;
	let gTimer: ReturnType<typeof setTimeout> | undefined;

	function handleKeydown(e: KeyboardEvent) {
		if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
			e.preventDefault();
			toggle();
			return;
		}
		if (open) {
			switch (e.key) {
				case 'ArrowDown':
					e.preventDefault();
					moveSelection(1);
					return;
				case 'ArrowUp':
					e.preventDefault();
					moveSelection(-1);
					return;
				case 'Enter':
					e.preventDefault();
					if (filtered[selectedIndex]) {
						navigate(filtered[selectedIndex]);
					}
					return;
				case 'Escape':
					e.preventDefault();
					close();
					return;
				default:
					return;
			}
		}
		if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;

		if (e.key === 'g' && !gPending) {
			gPending = true;
			if (gTimer) clearTimeout(gTimer);
			gTimer = setTimeout(() => { gPending = false; }, 500);
			return;
		}
		if (gPending) {
			gPending = false;
			if (gTimer) clearTimeout(gTimer);
			const combo = `g ${e.key}`;
			const match = allItems.find((item) => item.shortcut === combo);
			if (match) {
				e.preventDefault();
				goto(match.href);
			}
			return;
		}
	}

	function handleInputKeydown(e: KeyboardEvent) {
		// Arrow/Enter/Escape handled by global handler when open
	}

	function toggle() {
		open = !open;
		if (open) {
			query = '';
			selectedIndex = 0;
			updateFiltered();
			tick().then(() => inputEl?.focus());
		}
	}

	function close() {
		open = false;
	}

	function navigate(item: PaletteItem) {
		close();
		goto(item.href);
	}

	function handleInput() {
		updateFiltered();
	}

	onMount(() => {
		const entityPages: PaletteItem[] = get(preferences.kongEntities).map((e): PaletteItem => ({
			label: capitalizeFirstLetter(e.name),
			sublabel: e.apiPath,
			href: `${base}/entities?type=${e.name}`,
			type: 'entity',
		}));
		const settingsPage: PaletteItem[] = $config?.source === 'local'
			? [{ label: 'Settings', href: `${base}/settings`, type: 'page' as const, shortcut: 'g x' }]
			: [];
		allItems = [...assignShortcuts(entityPages), ...pages, ...settingsPage];
		updateFiltered();
	});

	$: {
		const showSettings = $config?.source === 'local';
		const hasSettings = allItems.some(i => i.label === 'Settings');
		if (showSettings && !hasSettings) {
			allItems = [...allItems, { label: 'Settings', href: `${base}/settings`, type: 'page' as const, shortcut: 'g x' }];
			updateFiltered();
		} else if (!showSettings && hasSettings) {
			allItems = allItems.filter(i => i.label !== 'Settings');
			updateFiltered();
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

{#if open}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div
		class="fixed inset-0 z-[1200] flex items-start justify-center pt-[15vh] bg-black/40 backdrop-blur-sm"
		transition:fade={{ duration: 100 }}
		on:click={close}
		role="dialog"
		aria-modal="true"
	>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div
			class="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl border border-[var(--glass-border)] bg-white dark:bg-[#1c1e20]"
			transition:scale={{ duration: 120, start: 0.97 }}
			on:click|stopPropagation
			role="listbox"
		>
			<div class="flex items-center gap-3 px-5 py-4 border-b border-[var(--glass-border)]">
				<svg class="w-5 h-5 text-[var(--text-tertiary)] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
				</svg>
				<input
					bind:this={inputEl}
					bind:value={query}
					on:keydown={handleInputKeydown}
					on:input={handleInput}
					class="flex-1 bg-transparent border-none outline-none text-base text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]"
					placeholder="Search pages and entities…"
					autocomplete="off"
					spellcheck="false"
				/>
				<kbd class="text-[11px] px-1.5 py-0.5 rounded bg-black/[0.06] dark:bg-white/[0.08] text-[var(--text-tertiary)] font-mono">esc</kbd>
			</div>

			<div class="max-h-[320px] overflow-y-auto py-2">
				{#if filtered.length === 0}
					<p class="px-5 py-4 text-sm text-[var(--text-tertiary)]">No results found.</p>
				{:else}
					{#each filtered as item, i}
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<div
							class="flex items-center gap-3 px-5 py-2.5 cursor-pointer transition-colors palette-item"
							class:palette-item-active={i === selectedIndex}
							on:click={() => navigate(item)}
							role="option"
							aria-selected={i === selectedIndex}
						>
							<span class="text-[10px] uppercase tracking-wider font-semibold rounded px-1.5 py-0.5 {item.type === 'entity' ? 'bg-[var(--accent)]/10 text-[var(--accent)]' : 'bg-[var(--success)]/10 text-[var(--success)]'}">
								{item.type}
							</span>
							<span class="text-sm font-medium text-[var(--text-primary)]">{item.label}</span>
							{#if item.sublabel}
								<span class="text-xs text-[var(--text-tertiary)] font-mono">{item.sublabel}</span>
							{/if}
							{#if item.shortcut}
								<kbd class="ml-auto text-[11px] px-1.5 py-0.5 rounded bg-black/[0.05] dark:bg-white/[0.07] text-[var(--text-tertiary)] font-mono">{item.shortcut}</kbd>
							{/if}
						</div>
					{/each}
				{/if}
			</div>

			<div class="px-5 py-2.5 border-t border-[var(--glass-border)] flex items-center gap-4 text-[11px] text-[var(--text-tertiary)]">
				<span><kbd class="font-mono">↑↓</kbd> navigate</span>
				<span><kbd class="font-mono">↵</kbd> open</span>
				<span><kbd class="font-mono">esc</kbd> close</span>
			</div>
		</div>
	</div>
{/if}

<style>
	.palette-item:hover:not(.palette-item-active) {
		background: rgba(0, 0, 0, 0.03);
	}
	:global(.dark) .palette-item:hover:not(.palette-item-active) {
		background: rgba(255, 255, 255, 0.04);
	}
	.palette-item-active {
		background: rgb(238 242 255);
	}
	:global(.dark) .palette-item-active {
		background: rgba(99, 102, 241, 0.1);
	}
</style>
