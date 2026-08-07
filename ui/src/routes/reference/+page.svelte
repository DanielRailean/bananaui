<div class="p-6 max-w-4xl mx-auto dark:text-stone-300 text-stone-800 font-light">
	<h1 class="text-3xl mb-6 dark:text-zinc-300">Reference</h1>

	<section class="mb-8">
		<h2 class="text-2xl mb-4 dark:text-zinc-300">Search Syntax</h2>
		<p class="mb-4">
			The entity list filter matches against the full JSON representation of each entity.
			All text matching is case-insensitive.
			It supports text matching, negation, logical operators, and array length assertions.
		</p>

		<h3 class="text-xl mb-2 mt-6 dark:text-zinc-400">Operators</h3>

		<table class="w-full mb-4 text-sm border-collapse">
			<thead class="dark:bg-stone-800 bg-gray-200">
				<tr>
					<th class="p-2 text-left">Operator</th>
					<th class="p-2 text-left">Syntax</th>
					<th class="p-2 text-left">Description</th>
					<th class="p-2 text-left">Example</th>
				</tr>
			</thead>
			<tbody>
				<tr class="border-t dark:border-stone-700">
					<td class="p-2">OR (group level)</td>
					<td class="p-2"><code>,</code> (comma)</td>
					<td class="p-2">Separates independent groups; entity matches if it passes ANY group</td>
					<td class="p-2"><code>prod, staging</code></td>
				</tr>
				<tr class="border-t dark:border-stone-700">
					<td class="p-2">AND</td>
					<td class="p-2"><code>&&</code></td>
					<td class="p-2">Within a group, all AND conditions must pass</td>
					<td class="p-2"><code>host && /api</code></td>
				</tr>
				<tr class="border-t dark:border-stone-700">
					<td class="p-2">OR (condition level)</td>
					<td class="p-2"><code>||</code></td>
					<td class="p-2">Within an AND block, any OR condition can match</td>
					<td class="p-2"><code>prod || staging</code></td>
				</tr>
				<tr class="border-t dark:border-stone-700">
					<td class="p-2">NOT</td>
					<td class="p-2"><code>!</code></td>
					<td class="p-2">Excludes entities containing the term</td>
					<td class="p-2"><code>!deprecated</code></td>
				</tr>
				<tr class="border-t dark:border-stone-700">
					<td class="p-2">Length equals</td>
					<td class="p-2"><code>.len == N</code></td>
					<td class="p-2">Array field has exactly N elements</td>
					<td class="p-2"><code>tags.len == 2</code></td>
				</tr>
				<tr class="border-t dark:border-stone-700">
					<td class="p-2">Length not equals</td>
					<td class="p-2"><code>.len != N</code></td>
					<td class="p-2">Array field does not have N elements</td>
					<td class="p-2"><code>tags.len != 0</code></td>
				</tr>
			</tbody>
		</table>

		<h3 class="text-xl mb-2 mt-6 dark:text-zinc-400">Evaluation Order</h3>
		<p class="mb-4 text-sm">
			<code class="dark:bg-stone-800 bg-gray-200 px-2 py-0.5 rounded">groupA, groupB</code> →
			each group evaluated independently (OR). Within a group:
			<code class="dark:bg-stone-800 bg-gray-200 px-2 py-0.5 rounded">condA && condB</code> →
			both must pass (AND). Within an AND condition:
			<code class="dark:bg-stone-800 bg-gray-200 px-2 py-0.5 rounded">x || y</code> →
			any match satisfies (OR).
		</p>
		<p class="mb-4 text-sm text-stone-500">
			Precedence (highest to lowest): <code>||</code> → <code>&&</code> → <code>,</code>
		</p>

		<h3 class="text-xl mb-2 mt-6 dark:text-zinc-400">Examples</h3>
		<div class="space-y-4 text-sm">
			<div>
				<code class="dark:bg-stone-800 bg-gray-200 px-2 py-0.5 rounded">host && !deprecated</code>
				<p class="mt-1 text-stone-500">Matches entities containing "host" but NOT "deprecated".</p>
			</div>
			<div>
				<code class="dark:bg-stone-800 bg-gray-200 px-2 py-0.5 rounded">host && !deprecated && tags.len == 2</code>
				<p class="mt-1 text-stone-500">Same as above, plus must have exactly 2 tags.</p>
			</div>
			<div>
				<code class="dark:bg-stone-800 bg-gray-200 px-2 py-0.5 rounded">prod || staging && tags.len == 1</code>
				<p class="mt-1 text-stone-500">Matches entities containing "prod" OR "staging", AND having exactly 1 tag.</p>
			</div>
			<div>
				<code class="dark:bg-stone-800 bg-gray-200 px-2 py-0.5 rounded">hello && test, no || test.len == 2 && no, yes.len != 2</code>
				<p class="mt-1 text-stone-500">Three groups separated by commas. Entity matches if it satisfies any one group.</p>
			</div>
		</div>

		<h3 class="text-xl mb-2 mt-6 dark:text-zinc-400">Fuzzy Search</h3>
		<p class="mb-4 text-sm">
			When the <strong>Fuzzy search</strong> toggle is enabled, the filter uses typo-tolerant matching
			instead of exact substring matching. The DSL operators (<code>&&</code>, <code>,</code>,
			<code>||</code>, <code>!</code>, <code>.len</code>) still work the same way — only the
			text matching step becomes fuzzy.
		</p>
	</section>
</div>
