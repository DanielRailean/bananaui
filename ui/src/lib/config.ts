import type { IKongEntity } from './types';

export const staticConfig = {
	autoLoginDelayMs: 100,
	name: 'Banana UI'
};
export const paginationSizeUi = 20;

export const paginationSize = 1000;
export const paginationAwaitBetweenPages = 0;

export const dateFields = ['created_at', 'updated_at', 'last_seen'];
export const fieldOrder = [
	// common
	'name',
	'id',
	'enabled',

	// sub entities of service
	'service',
	'route',
	'consumer',
	'instance_name',

	// service
	'protocol',
	'host',
	'port',
	'path',
	'tls_verify',
	'tls_verify_depth',

	// route
	'protocols',
	'hosts',
	'headers',
	'paths',
	'methods',

	// common

	// plugins
	'config',

	// service
	'connect_timeout',
	'write_timeout',
	'read_timeout',
	'retries',
	'client_certificate',
	'ca_certificates',

	// common
	...dateFields
];

type AnyObject = { [key: string]: any };

export function sortObjectFieldsByOrder<T extends AnyObject>(
	obj: T,
	order: string[],
	fallbackToAlphabetical = true
): T {
	const sortedEntries = Object.entries(obj).sort(([keyA], [keyB]) => {
		const indexA = order.indexOf(keyA);
		const indexB = order.indexOf(keyB);

		// Handle cases where keys are not in the order array
		if (indexA === -1 && indexB === -1) {
			if (fallbackToAlphabetical) {
				return keyA.localeCompare(keyB);
			}
			return 0;
		}
		if (indexA === -1) return 1; // Place undefined keys last
		if (indexB === -1) return -1;

		return indexA - indexB;
	});

	// Reconstruct the object
	return Object.fromEntries(sortedEntries) as T;
}

export const kongEntities: IKongEntity[] = [
	{
		name: 'services',
		displayedFields: ['name', 'host', 'port', 'path', 'enabled', 'updated_at'],
		apiPath: 'services',
		subEntities: ['routes', 'plugins'],
		sortBy: 'updated_at',
		sortAscending: false,
		uiSpaceBefore: true,
		defaultAddValue: {
			url: "https://example.com"
		}
	},
	{
		name: 'routes',
		displayedFields: ['name', 'methods', 'paths', 'service', 'updated_at'],
		apiPath: 'routes',
		subEntities: ['plugins'],
		defaultAddValue: {
			name: "",
			paths: [],
			methods: [],
			strip_path: false
		}
	},
	{
		name: 'plugins',
		displayedFields: ['name', 'service', 'route', 'enabled', 'updated_at'],
		apiPath: 'plugins',
		uiSpaceAfter: true
	},
	{ name: 'certificates', displayedFields: ['id', 'tags', 'updated_at'], apiPath: 'certificates' },
	{ name: 'ca_certificates', displayedFields: ['id', 'tags', 'updated_at'], apiPath: 'ca_certificates' },
	{
		name: 'consumers', displayedFields: ['username', 'custom_id', 'updated_at'], apiPath: 'consumers',
		defaultAddValue: {
			username: "",
			custom_id: ""
		}
	},
	{
		name: 'upstreams', displayedFields: ['name', 'updated_at'],
		subEntities: ['targets'],
		apiPath: 'upstreams',
		defaultAddValue: {
			name: ""
		}
	},
	{ name: 'targets', displayedFields: ['target', 'weight', 'updated_at'], apiPath: 'targets', showInMenu: false },
	{ name: 'keys', displayedFields: ['name', 'kid', 'updated_at'], apiPath: 'keys' },
	{
		name: 'key-sets',
		displayedFields: ['name', 'id', 'updated_at'],
		subEntities: ['keys'],
		apiPath: 'key-sets',
		defaultAddValue: { name: 'my_keyset_name' }
	},
	{ name: 'snis', displayedFields: undefined, apiPath: 'snis' },
	{ name: 'vaults', displayedFields: undefined, apiPath: 'vaults' },
	{
		name: 'dataplanes',
		displayedFields: ['hostname', 'last_seen', 'labels', 'sync_status', 'version', 'config_hash'],
		apiPath: 'clustering/data-planes',
		uiSpaceAfter: true,
		uiSpaceBefore: true
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
