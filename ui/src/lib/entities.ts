export const entityFields: Record<string, string[]> = {
	services: ['name', 'host', 'port', 'path', 'enabled', 'created_at'],
	routes: ['name', 'paths', 'methods', 'protocols', 'created_at'],
	plugins: ['name', 'service', 'route', 'created_at'],
	keys: ['name', 'kid', 'updated_at'],
	vaults: [],
	upstreams: [],
	ca_certificates: [],
	certificates: [],
	consumers: [],
	'key-sets': [],
	snis: [],
	'clustering/data-planes': []
};
