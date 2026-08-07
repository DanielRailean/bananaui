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

		<div>
			<AnchorHeading id="fuzzy-search">Fuzzy Search</AnchorHeading>
			<p class="text-sm leading-relaxed">
				When the <strong>Fuzzy</strong> toggle is enabled (appears when typing in the filter),
				text matching becomes typo-tolerant — e.g. "moch" will match "mock".
				All DSL operators still work the same way.
			</p>
		</div>
	</section>
</div>
