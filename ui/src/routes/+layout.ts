export const prerender =
	(globalThis.process != undefined && globalThis.process.env.SVELTE_BUILD_STATIC === 'true') ??
	false;
