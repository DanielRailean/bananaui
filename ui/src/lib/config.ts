import type { DumpOptions } from 'js-yaml';

export const staticConfig = {
	autoLoginDelayMs: 100,
	name: 'Banana UI'
};

export const yamlDumpOptions: DumpOptions = {
		noArrayIndent: true,
		noRefs: true,
		noCompatMode: true,
		quotingType: '"',
		lineWidth: 9999
	};

export const dateFields = ['created_at', 'updated_at', 'last_seen'];
export const fieldOrder = [
	// common
	'enabled',
	'name',
	'id',

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
