<script lang="ts">
	import AnchorHeading from '$lib/components/AnchorHeading.svelte';
</script>

<div class="p-6 max-w-4xl mx-auto dark:text-stone-300 text-stone-800 font-light">
	<h1 class="text-3xl mb-8 dark:text-zinc-300">Reference</h1>

	<section class="mb-8">
		<AnchorHeading id="search-syntax" level="h2">Search Syntax</AnchorHeading>
		<p class="mb-6 text-sm leading-relaxed">
			The filter matches against the full JSON of each entity. All text matching is case-insensitive.
		</p>

		<div class="mb-8 space-y-3">
			<AnchorHeading id="operators">Operators</AnchorHeading>
			<div class="grid grid-cols-[auto_auto_1fr] gap-x-4 gap-y-2 text-sm">
				<code class="dark:bg-stone-800 bg-gray-200 px-2 py-0.5 rounded text-center">,</code>
				<span class="text-stone-500 dark:text-stone-400">OR (group)</span>
				<span>Separates independent groups — matches if ANY group passes</span>

				<code class="dark:bg-stone-800 bg-gray-200 px-2 py-0.5 rounded text-center">&&</code>
				<span class="text-stone-500 dark:text-stone-400">AND</span>
				<span>All conditions in a group must pass</span>

				<code class="dark:bg-stone-800 bg-gray-200 px-2 py-0.5 rounded text-center">||</code>
				<span class="text-stone-500 dark:text-stone-400">OR (condition)</span>
				<span>Any condition within an AND block can match</span>

				<code class="dark:bg-stone-800 bg-gray-200 px-2 py-0.5 rounded text-center">!</code>
				<span class="text-stone-500 dark:text-stone-400">NOT</span>
				<span>Excludes entities containing the term</span>

				<code class="dark:bg-stone-800 bg-gray-200 px-2 py-0.5 rounded text-center">.len == N</code>
				<span class="text-stone-500 dark:text-stone-400">Length equals</span>
				<span>Array field has exactly N elements</span>

				<code class="dark:bg-stone-800 bg-gray-200 px-2 py-0.5 rounded text-center">.len != N</code>
				<span class="text-stone-500 dark:text-stone-400">Length not equals</span>
				<span>Array field does not have N elements</span>
			</div>
		</div>

		<div class="mb-8">
			<AnchorHeading id="evaluation-order">Evaluation Order</AnchorHeading>
			<p class="text-sm mb-3 leading-relaxed">
				Precedence (highest → lowest):
				<code class="dark:bg-stone-800 bg-gray-200 px-1.5 py-0.5 rounded">||</code> →
				<code class="dark:bg-stone-800 bg-gray-200 px-1.5 py-0.5 rounded">&&</code> →
				<code class="dark:bg-stone-800 bg-gray-200 px-1.5 py-0.5 rounded">,</code>
			</p>
			<div class="text-sm space-y-1 text-stone-500 dark:text-stone-400">
				<p><code>,</code> splits into independent groups (any group can match)</p>
				<p><code>&&</code> splits within a group (all parts must match)</p>
				<p><code>||</code> splits within an AND part (any alternative can match)</p>
			</div>
		</div>

		<div class="mb-8">
			<AnchorHeading id="examples">Search Examples</AnchorHeading>
			<div class="space-y-3 text-sm">
				<div class="dark:bg-stone-900 bg-gray-50 rounded-lg p-3">
					<code class="dark:text-zinc-200">host && !deprecated</code>
					<p class="mt-1.5 text-stone-500">Contains "host" but not "deprecated".</p>
				</div>
				<div class="dark:bg-stone-900 bg-gray-50 rounded-lg p-3">
					<code class="dark:text-zinc-200">host && !deprecated && tags.len == 2</code>
					<p class="mt-1.5 text-stone-500">Contains "host", excludes "deprecated", and has exactly 2 tags.</p>
				</div>
				<div class="dark:bg-stone-900 bg-gray-50 rounded-lg p-3">
					<code class="dark:text-zinc-200">prod || staging && tags.len == 1</code>
					<p class="mt-1.5 text-stone-500">Contains "prod" or "staging", and has exactly 1 tag.
						<span class="italic">(<code>||</code> binds first → <code>(prod || staging)</code> then <code>&&</code> with <code>tags.len == 1</code>)</span>
					</p>
				</div>
				<div class="dark:bg-stone-900 bg-gray-50 rounded-lg p-3">
					<code class="dark:text-zinc-200">prod, staging</code>
					<p class="mt-1.5 text-stone-500">Two groups: matches entities containing "prod" or entities containing "staging".</p>
				</div>
				<div class="dark:bg-stone-900 bg-gray-50 rounded-lg p-3">
					<code class="dark:text-zinc-200">api && tags.len == 2, internal</code>
					<p class="mt-1.5 text-stone-500">Group 1: contains "api" with exactly 2 tags. Group 2: contains "internal". Matches either.</p>
				</div>
				<div class="dark:bg-stone-900 bg-gray-50 rounded-lg p-3">
					<code class="dark:text-zinc-200">https && !sandbox && tags.len != 0</code>
					<p class="mt-1.5 text-stone-500">Protocol is "https", excludes anything with "sandbox", and must have at least one tag.</p>
				</div>
				<div class="dark:bg-stone-900 bg-gray-50 rounded-lg p-3">
					<code class="dark:text-zinc-200">alpha || beta && !disabled && tags.len == 3, test && v2</code>
					<p class="mt-1.5 text-stone-500">
						Group 1: contains "alpha" or "beta", not disabled, with exactly 3 tags.<br/>
						Group 2: contains both "test" and "v2".<br/>
						<span class="italic">Parsed as: <code>((alpha || beta) && !disabled && tags.len == 3)</code> , <code>(test && v2)</code></span>
					</p>
				</div>
				<div class="dark:bg-stone-900 bg-gray-50 rounded-lg p-3">
					<code class="dark:text-zinc-200">web || mobile && !legacy, backend && tags.len == 5</code>
					<p class="mt-1.5 text-stone-500">
						Group 1: contains "web" or "mobile", excludes "legacy".<br/>
						Group 2: contains "backend" with exactly 5 tags.
					</p>
				</div>
			</div>
		</div>

		<div class="mb-8">
			<AnchorHeading id="fuzzy-search">Fuzzy Search</AnchorHeading>
			<p class="text-sm leading-relaxed">
				When the <strong>Fuzzy</strong> toggle is enabled (appears when typing in the filter),
				text matching becomes typo-tolerant — e.g. "moch" will match "mock".
				All DSL operators still work the same way.
			</p>
		</div>
	</section>

	<section class="mb-8">
		<AnchorHeading id="copy-behavior" level="h2">Copy Behavior</AnchorHeading>
		<p class="mb-4 text-sm leading-relaxed">
			Copy actions use click count to distinguish format: single click copies as JSON, double click copies as YAML.
		</p>
		<div class="space-y-3 text-sm">
			<div class="dark:bg-stone-900 bg-gray-50 rounded-lg p-3">
				<code class="dark:text-zinc-200">Copy button (single click)</code>
				<p class="mt-1.5 text-stone-500">Copies the entity as JSON.</p>
			</div>
			<div class="dark:bg-stone-900 bg-gray-50 rounded-lg p-3">
				<code class="dark:text-zinc-200">Copy button (double click)</code>
				<p class="mt-1.5 text-stone-500">Copies the entity as YAML.</p>
			</div>
			<div class="dark:bg-stone-900 bg-gray-50 rounded-lg p-3">
				<code class="dark:text-zinc-200">Copy all (single / double click)</code>
				<p class="mt-1.5 text-stone-500">Copies all currently filtered entities as JSON or YAML. Shows a confirm dialog with the count.</p>
			</div>
			<div class="dark:bg-stone-900 bg-gray-50 rounded-lg p-3">
				<code class="dark:text-zinc-200">Double-click a field value</code>
				<p class="mt-1.5 text-stone-500">In list view or tree view, double-click any value to copy it.</p>
			</div>
			<div class="dark:bg-stone-900 bg-gray-50 rounded-lg p-3">
				<code class="dark:text-zinc-200">Double-click a key name</code>
				<p class="mt-1.5 text-stone-500">In tree view, double-click a key to copy the key name.</p>
			</div>
			<div class="dark:bg-stone-900 bg-gray-50 rounded-lg p-3">
				<code class="dark:text-zinc-200">Middle-click an entity row</code>
				<p class="mt-1.5 text-stone-500">Opens the entity detail page in a new browser tab.</p>
			</div>
		</div>
	</section>

	<section class="mb-8">
		<AnchorHeading id="bulk-operations" level="h2">Bulk Operations</AnchorHeading>

		<div class="mb-8">
			<AnchorHeading id="bulk-create">Bulk Create</AnchorHeading>
			<p class="text-sm leading-relaxed">
				On the add/create page, paste a <strong>JSON array</strong> of entities instead of a single object.
				Each entity in the array is created individually. A toast notification is shown per item.
			</p>
		</div>

		<div class="mb-8">
			<AnchorHeading id="bulk-update">Bulk Update</AnchorHeading>
			<p class="text-sm leading-relaxed">
				In any entity list, click <strong>"Bulk update"</strong> to open a JSON editor.
				Write a JSON patch (e.g. <code class="dark:bg-stone-800 bg-gray-200 px-1.5 py-0.5 rounded">{'{"tags": ["production"]}'}</code>)
				and click <strong>"apply"</strong>. The patch is applied to all <strong>currently filtered</strong> entities —
				use the search filter first to scope which entities are updated.
			</p>
		</div>

		<div>
			<AnchorHeading id="bulk-delete">Bulk Delete</AnchorHeading>
			<p class="text-sm leading-relaxed mb-2">
				Hidden by default. Enable via Preferences → <code class="dark:bg-stone-800 bg-gray-200 px-1.5 py-0.5 rounded">showDeleteAllButton</code>.
				Deletes all <strong>currently filtered</strong> entities with a three-stage confirmation:
			</p>
			<ol class="text-sm list-decimal list-inside space-y-1 text-stone-500 dark:text-stone-400">
				<li>Confirm total count of entities to delete</li>
				<li>Choose silent deletion or per-entity confirmation</li>
				<li>Final "last chance" warning</li>
			</ol>
		</div>
	</section>
</div>
