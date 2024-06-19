import type { IConfig } from '$lib/types';
import { error, json } from '@sveltejs/kit';

export function GET() {
	const configFile = process.env.BANANA_UI_CONFIG;
	if (!configFile) {
		error(404);
	}
	try {
		const parsed = JSON.parse(configFile);
		return json({
			...(parsed as IConfig)
		});
	} catch (err: any) {
		console.log(configFile);
		error(500, 'failed to parse');
	}
}
