import type { IKongEntity } from './types';

export const staticConfig = {
	autoLoginDelayMs: 100,
	name: 'Banana UI'
};

export const kongEntities: IKongEntity[] = [
	{
		name: 'services',
		displayedFields: ['name', 'host', 'port', 'path', 'enabled', 'created_at'],
		apiPath: 'services',
		subEntities: ['routes', 'plugins']
	},
	{
		name: 'routes',
		displayedFields: ['name', 'paths', 'methods', 'service', 'created_at'],
		apiPath: 'routes',
		subEntities: ['plugins']
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
