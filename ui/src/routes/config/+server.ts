import { error, json } from '@sveltejs/kit';

export function GET() {
	const configFile = process.env.BANANA_UI_CONFIG;
	if (!configFile) {
		error(404);
	}
	return json({
		...JSON.parse(configFile)
	});
}
