# Search Performance Improvement Plan

## Current Problems

1. **`JSON.stringify` per item per condition** — `itemPassesOrValidations` calls `JSON.stringify(obj).toLowerCase()` for every string condition check. For 1000 items × 3 conditions = 3000 stringify calls per keystroke.
2. **Query re-parsed every keystroke** — `getLogicalGroups` tokenizes the DSL on every `search()` invocation. No caching.
3. **O(n²) dedup** — `result.filter(onlyUnique)` uses `indexOf`, quadratic.
4. **No short-circuit on empty input returning early** — when `searchText.length == 0` the function still falls through to the `if (get(useNewSearch))` branch.
5. **Nested filter + find intersection** — `orPassed.filter(item => temp.find(...))` is O(n×m) per AND group.
6. **No debounce on search execution itself** — input fires `search()` synchronously on every keystroke for large datasets.

## Proposed Solution

### Option A: Use Fuse.js (recommended for simplicity)

- **Library**: [fuse.js](https://www.fusejs.io/) — lightweight (~5KB gzipped), fuzzy search with AND/OR logical operators built-in.
- Keep custom `.len ==` / `.len !=` operators as a pre-filter step.
- Fuse handles text matching with configurable threshold (exact or fuzzy).
- Supports weighted keys so you can prioritize `name` > `tags` > full JSON.

### Option B: Use FlexSearch (recommended for speed)

- **Library**: [flexsearch](https://github.com/nicxtrem2/flexsearch) — fastest JS search library benchmarked.
- Build index on data load, update incrementally on data change.
- Query the index instead of scanning all items.
- Custom operators (`.len`, `!`) handled as post-filters on the FlexSearch result set.

### Option C: Refactor in-place (no deps)

Keep current DSL, fix the hot paths:

1. **Cache serialized items** — build a `Map<string, string>` of `id → JSON.stringify(item).toLowerCase()` once on data change, not per search.
2. **Cache parsed query** — memoize `getLogicalGroups(input)` result; only recompute when input changes.
3. **Use Set for dedup** — replace `filter(onlyUnique)` with `Set<string>` on item IDs.
4. **Use Map for intersection** — replace `.filter(item => temp.find(...))` with a `Set` lookup: O(n) instead of O(n×m).
5. **Early return** — if `searchText.length == 0`, return immediately before entering either branch.

## Recommended Approach: Hybrid (Option C + Fuse.js fallback)

Refactor the custom DSL operators (`.len`, `!`, `&&`, `||`, `,`) as a **pre-filter pipeline**, then delegate text matching to Fuse.js for the string conditions. This gives:

- Fuzzy matching support (typo tolerance) as a bonus
- Fast indexed search for text conditions
- Custom operators preserved for array length assertions

## Implementation Steps

1. `pnpm add fuse.js`
2. Create `src/lib/searchEngine.ts`:
   - Export a `SearchEngine` class that wraps Fuse.js
   - On data change: rebuild Fuse index (keys: all string fields + JSON blob)
   - `search(query: string, data: T[]): T[]` method:
     - Parse DSL with improved `getLogicalGroups`
     - For `.len ==` / `.len !=` conditions: filter directly
     - For `!negation` conditions: exclude from results
     - For text conditions: query Fuse index
     - Combine with AND/OR logic using Set operations
3. Replace `doSearch` and legacy `search` filter with `SearchEngine.search()`
4. Cache the Fuse instance in a module-level variable; rebuild only on `dataRaw` change
5. Add 150ms debounce to `search()` call (already have `debouncedCall` util)
6. Remove `useNewSearch` preference toggle — unified engine replaces both modes

## DSL Simplification

Current DSL:
```
groupA, groupB          — OR between groups
condA && condB          — AND within group  
x || y                  — OR within AND block
field.len == N          — array length check
field.len != N          — array length not-equal
!term                   — negation
```

Proposed (keep same syntax, just better engine underneath). No breaking changes to user queries.

## Expected Gains

| Metric | Before | After |
|--------|--------|-------|
| 1000 items, 3 conditions | ~50-200ms per keystroke | <5ms |
| JSON.stringify calls | N × conditions | 1 × N (on data load) |
| Dedup | O(n²) | O(n) |
| Intersection | O(n×m) | O(n) |
| Query parse | every keystroke | memoized |
