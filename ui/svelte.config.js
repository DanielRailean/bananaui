import adapter from '@sveltejs/adapter-node';
import * as staticAd from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { preprocessMeltUI, sequence } from '@melt-ui/pp';

/** @type {import('@sveltejs/kit').Config} */
let config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: sequence([vitePreprocess(), preprocessMeltUI()]),

	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter()
	}
};

if (process.env.SVELTE_BUILD_STATIC === 'true') {
	config = {
		preprocess: sequence([vitePreprocess(), preprocessMeltUI()]),
		kit: {
			adapter: staticAd.default({
				// default options are shown. On some platforms
				// these options are set automatically — see below
				pages: 'build',
				assets: 'build',
				// fallback: "index.html",
				precompress: false,
				strict: false
			}),
			paths: {
				base: '/bananaui',
				relative: true
			}
		}
	};
}

export default config;
