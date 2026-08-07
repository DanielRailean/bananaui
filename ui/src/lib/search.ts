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
function itemPassesOrValidations(obj: any, validation: any[]): boolean {
	const json = getCachedJson(obj);
	for (const condition of validation) {
		if (typeof condition === 'string') {
			if (condition.startsWith('!')) {
				const term = condition.substring(1).trim().toLowerCase();
				if (term.length > 0 && !json.includes(term)) {
					return true;
				}
			} else if (json.includes(condition.toLowerCase())) {
				return true;
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
			if (itemPassesOrValidations(obj, condition)) {
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

// loop over comma groups (OR), intersect && groups (AND), any || condition passes within a group
export function doSearch<T extends { id: string }>(input: string, arr: T[]): T[] {
	const orAndOr = getLogicalGroups(input);
	if (orAndOr.length == 0) {
		return arr;
	}
	const seenIds = new Set<string>();
	let result: T[] = [];
	for (const orGroup of orAndOr) {
		let orPassed: T[] | undefined = undefined;
		for (const orAndGroup of orGroup) {
			let temp = arr.filter((item: any) => itemPassesOrValidations(item, orAndGroup));
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
	function assert(name: string, actual: any, expected: any) {
		const a = JSON.stringify(actual);
		const e = JSON.stringify(expected);
		if (a === e) { passed++; }
		else { failed++; console.error(`FAIL: ${name}\n  expected: ${e}\n  actual:   ${a}`); }
	}

	const items = [
		{ id: '1', name: 'api-prod', tags: ['v1', 'v2'], enabled: true },
		{ id: '2', name: 'api-staging', tags: ['v1'], enabled: false },
		{ id: '3', name: 'web-prod', tags: [], enabled: true },
		{ id: '4', name: 'internal', tags: ['v1', 'v2', 'v3'], enabled: true },
	];

	// basic text match
	assert('text match', doSearch('prod', items).map(i => i.id), ['1', '3']);

	// AND
	assert('AND', doSearch('prod && api', items).map(i => i.id), ['1']);

	// NOT
	assert('NOT', doSearch('!prod', items).map(i => i.id), ['2', '4']);

	// AND + NOT
	assert('AND+NOT', doSearch('api && !staging', items).map(i => i.id), ['1']);

	// OR via comma
	assert('comma OR', doSearch('internal, web', items).map(i => i.id), ['4', '3']);

	// OR via ||
	assert('|| OR', doSearch('internal || web-prod', items).map(i => i.id), ['1', '2', '3', '4']);

	// .len ==
	assert('len ==', doSearch('tags.len == 1', items).map(i => i.id), ['2']);

	// .len !=
	assert('len !=', doSearch('tags.len != 0', items).map(i => i.id), ['1', '2', '4']);

	// combined: comma group + && + .len
	assert('combined', doSearch('prod && tags.len == 2, internal', items).map(i => i.id), ['1', '4']);

	// empty input returns all
	assert('empty', doSearch('', items).map(i => i.id), ['1', '2', '3', '4']);

	// no match
	assert('no match', doSearch('nonexistent', items).map(i => i.id), []);

	// getLogicalGroups
	assert('parse empty', getLogicalGroups(''), []);
	assert('parse simple', getLogicalGroups('hello').length, 1);

	console.log(`\n${passed} passed, ${failed} failed`);
	process.exit(failed > 0 ? 1 : 0);
}
