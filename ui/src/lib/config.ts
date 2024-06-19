export const staticConfig = {
	autoLogin: false,
	name: 'Banana UI'
};

interface kongEntity {
	name: string;
	apiPath: string;
	displayedFields: string[];
}

export const kongEntities: kongEntity[] = [
	{
		name: 'services',
		displayedFields: ['name', 'host', 'port', 'path', 'enabled', 'created_at'],
		apiPath: 'services'
	},
	{
		name: 'routes',
		displayedFields: ['name', 'paths', 'methods', 'protocols', 'created_at'],
		apiPath: 'routes'
	},
	{
		name: 'plugins',
		displayedFields: ['name', 'service', 'route', 'created_at'],
		apiPath: 'plugins'
	},
	{ name: 'keys', displayedFields: ['name', 'kid', 'updated_at'], apiPath: 'keys' },
	{ name: 'vaults', displayedFields: [], apiPath: 'vaults' },
	{ name: 'upstreams', displayedFields: [], apiPath: 'upstreams' },
	{ name: 'ca_certificates', displayedFields: [], apiPath: 'ca_certificates' },
	{ name: 'certificates', displayedFields: [], apiPath: 'certificates' },
	{ name: 'consumers', displayedFields: [], apiPath: 'consumers' },
	{ name: 'keysets', displayedFields: [], apiPath: 'key-sets' },
	{ name: 'snis', displayedFields: [], apiPath: 'snis' },
	{ name: 'dataplanes', displayedFields: [], apiPath: 'clustering/data-planes' }
];
