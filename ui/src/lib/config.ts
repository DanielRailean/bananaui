import type { IKongEntity } from './types';

export const staticConfig = {
	autoLoginDelayMs: 100,
	name: 'Banana UI'
};

export const paginationSize = 1000;
export const paginationAwaitBetweenPages = 0;

export const dateFields = ['created_at', 'updated_at', 'last_seen'];
export const kongEntities: IKongEntity[] = [
	{
		name: 'services',
		displayedFields: ['name', 'host', 'port', 'path', 'enabled', 'updated_at'],
		apiPath: 'services',
		subEntities: ['routes', 'plugins'],
		sortBy: 'updated_at',
		sortAscending: false
	},
	{
		name: 'routes',
		displayedFields: ['name', 'paths', 'methods', 'service', 'updated_at'],
		apiPath: 'routes',
		subEntities: ['plugins']
	},
	{
		name: 'plugins',
		displayedFields: ['name', 'service', 'route', 'enabled', 'updated_at'],
		apiPath: 'plugins'
	},
	{ name: 'keys', displayedFields: ['name', 'kid', 'updated_at'], apiPath: 'keys' },
	{ name: 'vaults', displayedFields: undefined, apiPath: 'vaults' },
	{ name: 'upstreams', displayedFields: undefined, apiPath: 'upstreams' },
	{ name: 'ca_certificates', displayedFields: undefined, apiPath: 'ca_certificates' },
	{ name: 'certificates', displayedFields: undefined, apiPath: 'certificates' },
	{ name: 'consumers', displayedFields: undefined, apiPath: 'consumers' },
	{ name: 'keysets', displayedFields: undefined, apiPath: 'key-sets' },
	{ name: 'snis', displayedFields: undefined, apiPath: 'snis' },
	{
		name: 'dataplanes',
		displayedFields: ['last_seen', 'ip', 'sync_status', 'version', 'hostname', 'config_hash'],
		apiPath: 'clustering/data-planes'
	}
];

export const preferences = {
	copyElementOnSingleElementArray: {
		type: 'boolean',
		default: true
	},
	showSelfLinkOnSubEntities: {
		type: 'boolean',
		default: false
	}
};
