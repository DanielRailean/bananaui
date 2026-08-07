// WeakMap so entries are GC'd when items are replaced on data refresh
const jsonCache = new WeakMap<object, string>();

function getCachedJson(obj: any): string {
	let cached = jsonCache.get(obj);
	if (!cached) {
		cached = JSON.stringify(obj).toLowerCase();
		jsonCache.set(obj, cached);
	}
	return cached;
}

// --- Fuse.js fuzzy search ---
import Fuse from 'fuse.js';

let fuseInstance: Fuse<any> | null = null;
let fuseDataRef: any[] | null = null;

function getFuse<T>(arr: T[]): Fuse<T> {
	if (fuseInstance && fuseDataRef === arr) return fuseInstance as Fuse<T>;
	const keys = arr.length > 0 ? Object.keys(arr[0] as any) : [];
	fuseInstance = new Fuse(arr, {
		keys,
		threshold: 0.4,
		ignoreLocation: true,
	});
	fuseDataRef = arr;
	return fuseInstance as Fuse<T>;
}

export function doFuzzySearch<T extends { id: string }>(input: string, arr: T[]): T[] {
	if (input.trim().length === 0) return arr;
	const fuse = getFuse(arr);
	return fuse.search(input).map(r => r.item);
}

function fuzzyMatch(obj: any, term: string, fuzzyMatchSets?: Map<string, Set<string>>): boolean {
	if (fuzzyMatchSets) {
		const set = fuzzyMatchSets.get(term);
		return set ? set.has((obj as any).id) : false;
	}
	const fuse = new Fuse([obj], {
		keys: Object.keys(obj),
		threshold: 0.4,
		ignoreLocation: true,
	});
	return fuse.search(term).length > 0;
}

// negative val = "not equal" (e.g. .len != 2 stored as -2), positive = "equal"
function itemPassesLength(obj: any, len: { [key: string]: number }): boolean {
	if (!obj) {
		return false;
	}
	for (const [key, val] of Object.entries(len)) {
		if (!obj[key] || !Array.isArray(obj[key])) {
			return false;
		}
		const arrayValue = obj[key];
		if (val < 0) {
			if (arrayValue.length === val * -1) {
				return false;
			}
		} else {
			if (arrayValue.length != val) {
				return false;
			}
		}
	}
	return true;
}

// OR semantics: returns true if ANY condition in the validation array matches
function itemPassesOrValidations(obj: any, validation: any[], fuzzy = false, fuzzyMatchSets?: Map<string, Set<string>>): boolean {
	const json = getCachedJson(obj);
	for (const condition of validation) {
		if (typeof condition === 'string') {
			if (condition.startsWith('!')) {
				const term = condition.substring(1).trim().toLowerCase();
				if (term.length > 0) {
					const matches = fuzzy ? fuzzyMatch(obj, term, fuzzyMatchSets) : json.includes(term);
					if (!matches) return true;
				}
			} else {
				const matches = fuzzy ? fuzzyMatch(obj, condition, fuzzyMatchSets) : json.includes(condition.toLowerCase());
				if (matches) return true;
			}
			continue;
		}
		if (Object.keys(condition).length > 0 && !Array.isArray(condition)) {
			if (itemPassesLength(obj, condition)) {
				return true;
			}
			continue;
		}
		if (Array.isArray(condition)) {
			if (itemPassesOrValidations(obj, condition, fuzzy, fuzzyMatchSets)) {
				return true;
			}
			continue;
		}
	}
	return false;
}

const lenNotEqOp = '.len != ';
const lenEqOp = '.len == ';

// Parses DSL into nested structure: [comma groups] -> [&& groups] -> [|| conditions]
// ex: "hello && test, no || test.len == 2 && no, yes.len != 2"
// becomes [[['hello'], ['test']], [['no', {test: 2}], ['no']], [[{yes: -2}]]]
export function getLogicalGroups(input: string): any[][][] {
	if (input.trim().length == 0) {
		return [];
	}
	const inputCommaSplit = input.split(',');
	let groups = [];
	for (const anyConditions of inputCommaSplit) {
		let andGroups = [];
		const booleanAndSearch = anyConditions.split(/\s*&&\s*/);
		for (const andCondition of booleanAndSearch) {
			let orGroups = [];
			const boolOrSearch = andCondition.split(/\s*\|\|\s*/);
			for (const orCondition of boolOrSearch) {
				if (orCondition.includes(lenNotEqOp) || orCondition.includes(lenEqOp)) {
					const lenNotEq: any = {};
					let split = orCondition.split(lenNotEqOp);
					let sign = -1;
					if (split.length == 1) {
						split = orCondition.split(lenEqOp);
						sign = 1;
					}
					lenNotEq[split[0].trim()] = +split[1].trim() * sign;
					orGroups.push(lenNotEq);
					continue;
				}
				orGroups.push(orCondition.trim());
			}
			andGroups.push(orGroups);
		}
		groups.push(andGroups);
	}
	return groups;
}

// Extract all text terms from parsed DSL groups
function extractTerms(groups: any[][][]): string[] {
	const terms: string[] = [];
	for (const orGroup of groups) {
		for (const andGroup of orGroup) {
			for (const cond of andGroup) {
				if (typeof cond === 'string') {
					const t = cond.startsWith('!') ? cond.substring(1).trim() : cond.trim();
					if (t.length > 0) terms.push(t);
				}
			}
		}
	}
	return [...new Set(terms)];
}

// Pre-compute which items match each term using full-array Fuse
function buildFuzzyMatchSets<T extends { id: string }>(terms: string[], arr: T[]): Map<string, Set<string>> {
	const fuse = getFuse(arr);
	const map = new Map<string, Set<string>>();
	for (const term of terms) {
		const ids = new Set(fuse.search(term).map(r => r.item.id));
		map.set(term, ids);
	}
	return map;
}

// loop over comma groups (OR), intersect && groups (AND), any || condition passes within a group
export function doSearch<T extends { id: string }>(input: string, arr: T[], fuzzy = false): T[] {
	const orAndOr = getLogicalGroups(input);
	if (orAndOr.length == 0) {
		return arr;
	}
	const fuzzyMatchSets = fuzzy ? buildFuzzyMatchSets(extractTerms(orAndOr), arr) : undefined;
	const seenIds = new Set<string>();
	let result: T[] = [];
	for (const orGroup of orAndOr) {
		let orPassed: T[] | undefined = undefined;
		for (const orAndGroup of orGroup) {
			let temp = arr.filter((item: any) => itemPassesOrValidations(item, orAndGroup, fuzzy, fuzzyMatchSets));
			if (!orPassed) {
				orPassed = temp;
			} else {
				const tempIds = new Set(temp.map((i) => i.id));
				orPassed = orPassed.filter((item) => tempIds.has(item.id));
			}
		}
		for (const item of orPassed ?? []) {
			if (!seenIds.has(item.id)) {
				seenIds.add(item.id);
				result.push(item);
			}
		}
	}
	return result;
}

// --- tests (run with: npx tsx src/lib/search.ts) ---
if (typeof process !== 'undefined' && process.argv[1]?.endsWith('search.ts')) {
	let passed = 0;
	let failed = 0;
	function assert(name: string, query: string, actual: any, expected: any) {
		const a = JSON.stringify(actual);
		const e = JSON.stringify(expected);
		if (a === e) { passed++; console.log(`  ✓ ${name}\n    input: ${query}  output: ${a}`); }
		else { failed++; console.error(`  ✗ ${name}\n    input: ${query}\n    expected: ${e}\n    actual:   ${a}`); }
	}

	const items = [
		{ id: '1', name: 'api-prod', tags: ['v1', 'v2'], enabled: true },
		{ id: '2', name: 'api-staging', tags: ['v1'], enabled: false },
		{ id: '3', name: 'web-prod', tags: [], enabled: true },
		{ id: '4', name: 'internal', tags: ['v1', 'v2', 'v3'], enabled: true },
	];

	const refItems = [
		{ id: '1', name: 'host-prod', tags: ['a', 'b'], host: 'example.com' },
		{ id: '2', name: 'host-deprecated', tags: ['old'], host: 'legacy.com', deprecated: true },
		{ id: '3', name: 'api-staging', tags: ['a'], host: 'stage.com' },
		{ id: '4', name: 'api-prod', tags: ['a', 'b', 'c'], host: 'prod.com' },
	];

	const refItems2 = [
		{ id: 'a', name: 'hello-test', tags: ['x'], yes: [1, 2] },
		{ id: 'b', name: 'no-thing', tags: ['x', 'y'], yes: [1] },
		{ id: 'c', name: 'yes-thing', tags: [], yes: [1, 2, 3] },
	];

	for (const fuzzy of [false, true]) {
		const prefix = fuzzy ? '[fuzzy] ' : '';

		assert(prefix + 'text match', 'prod', doSearch('prod', items, fuzzy).map(i => i.id), ['1', '3']);
		
    assert(prefix + 'AND', 'prod && api', doSearch('prod && api', items, fuzzy).map(i => i.id), ['1']);
		
    assert(prefix + 'NOT', '!prod', doSearch('!prod', items, fuzzy).map(i => i.id), ['2', '4']);
		
    assert(prefix + 'AND+NOT', 'api && !staging', doSearch('api && !staging', items, fuzzy).map(i => i.id), ['1']);
		
    assert(prefix + 'comma OR', 'internal, web', doSearch('internal, web', items, fuzzy).map(i => i.id), ['4', '3']);
		
    assert(prefix + '|| OR', 'internal || web-prod', doSearch('internal || web-prod', items, fuzzy).map(i => i.id),
		
    fuzzy ? ['1', '3', '4'] : ['3', '4']);
		
      assert(prefix + 'len ==', 'tags.len == 1', doSearch('tags.len == 1', items, fuzzy).map(i => i.id), ['2']);
		
    assert(prefix + 'len !=', 'tags.len != 2', doSearch('tags.len != 2', items, fuzzy).map(i => i.id), ['2', '3', '4']);
		
    assert(prefix + 'combined', 'prod && tags.len == 2, internal', doSearch('prod && tags.len == 2, internal', items, fuzzy).map(i => i.id), ['1', '4']);
		
    assert(prefix + 'empty', '(empty)', doSearch('', items, fuzzy).map(i => i.id), ['1', '2', '3', '4']);
		
    assert(prefix + 'no match', 'nonexistent', doSearch('nonexistent', items, fuzzy).map(i => i.id), []);
		
    assert(prefix + 'ref: AND+NOT', 'host && !deprecated', doSearch('host && !deprecated', refItems, fuzzy).map(i => i.id),
		
    fuzzy ? ['1'] : ['1', '3', '4']);
		
    assert(prefix + 'ref: AND+NOT+len', 'host && !deprecated && tags.len == 2', doSearch('host && !deprecated && tags.len == 2', refItems, fuzzy).map(i => i.id), ['1']);
		
    assert(prefix + 'ref: ||+&&+len', 'prod || staging && tags.len == 1', doSearch('prod || staging && tags.len == 1', refItems, fuzzy).map(i => i.id), ['3']);
		
    assert(prefix + 'ref: multi-group', 'hello && test, no || tags.len == 2 && no, yes.len != 2',
			doSearch('hello && test, no || tags.len == 2 && no, yes.len != 2', refItems2, fuzzy).map(i => i.id),
			['a', 'b', 'c']);
	}

	// doFuzzySearch (exported, uses Fuse directly without DSL)
	assert('fuzzySearch: basic', 'prod', doFuzzySearch('prod', items).map(i => i.id), ['1', '3']);
	assert('fuzzySearch: empty input', '(empty)', doFuzzySearch('', items).map(i => i.id), ['1', '2', '3', '4']);
	assert('fuzzySearch: no match', 'zzzzz', doFuzzySearch('zzzzz', items).map(i => i.id), []);
	assert('fuzzySearch: typo', 'iternal', doFuzzySearch('iternal', items).map(i => i.id), ['4']);

	// fuzzy DSL typo tolerance (uses full-array Fuse)
	assert('fuzzy DSL: typo match', 'stagin', doSearch('stagin', items, true).map(i => i.id), ['2']);
	assert('fuzzy DSL: typo + AND', 'stagin && api', doSearch('stagin && api', items, true).map(i => i.id), ['2']);
	assert('fuzzy DSL: typo + NOT', '!stagin', doSearch('!stagin', items, true).map(i => i.id), ['1', '3', '4']);

	// case insensitivity
	assert('case insensitive: upper', 'PROD', doSearch('PROD', items).map(i => i.id), ['1', '3']);
	assert('case insensitive: mixed', 'Api-Prod', doSearch('Api-Prod', items).map(i => i.id), ['1']);

	// whitespace-only input
	assert('whitespace only', '(spaces)', doSearch('   ', items).map(i => i.id), ['1', '2', '3', '4']);

	// len == 0 (empty array)
	assert('len == 0', 'tags.len == 0', doSearch('tags.len == 0', items).map(i => i.id), ['3']);

	// negation-only
	assert('negation only', '!api', doSearch('!api', items).map(i => i.id), ['3', '4']);

	// multiple NOT
	assert('multi NOT', '!prod && !api', doSearch('!prod && !api', items).map(i => i.id), ['4']);

	// duplicate comma groups (dedup)
	assert('dedup comma', 'prod, prod', doSearch('prod, prod', items).map(i => i.id), ['1', '3']);

	// getLogicalGroups
	assert('parse empty', '(empty)', getLogicalGroups(''), []);
	assert('parse simple', 'hello', getLogicalGroups('hello').length, 1);
	assert('parse AND+OR structure', 'a && b || c',
		getLogicalGroups('a && b || c'),
		[[['a'], ['b', 'c']]]);
	assert('parse comma groups', 'x, y && z',
		getLogicalGroups('x, y && z'),
		[[['x']], [['y'], ['z']]]);
	assert('parse len ops', 'foo.len == 3 && bar.len != 1',
		getLogicalGroups('foo.len == 3 && bar.len != 1'),
		[[[{ foo: 3 }], [{ bar: -1 }]]]);

	console.log(`\n${passed} passed, ${failed} failed`);
	if (failed > 0) throw new Error(`${failed} test(s) failed`);
}
