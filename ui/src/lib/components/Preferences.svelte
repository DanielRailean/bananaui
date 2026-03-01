<script lang="ts">
	import {
		getPreferencesAsJson,
		getPreferencesObject,
		preferences,
		savePreferences,
		setPreferences
	} from '$lib/stores';
	import { onMount } from 'svelte';
	import type { IKongEntity } from '$lib/types';

	export const kongEntities: IKongEntity[] = [
		{
			name: 'services',
			displayedFields: ['enabled', 'name', 'host', 'id', 'updated_at'],
			apiPath: 'services',
			subEntities: ['plugins', 'routes'],
			sortBy: 'updated_at',
			sortAscending: false,
			uiSpaceBefore: true,
			defaultAddValue: {
				url: 'https://example.com'
			},
			logo: 'globe'
		},
		{
			name: 'routes',
			displayedFields: ['methods', 'paths', 'service', 'updated_at'],
			apiPath: 'routes',
			subEntities: ['plugins'],
			defaultAddValue: {
				name: '',
				paths: [],
				methods: [],
				strip_path: false
			},
			logo: 'shuffle'
		},
		{
			name: 'plugins',
			displayedFields: ['enabled', 'name', 'service', 'route', 'updated_at'],
			apiPath: 'plugins',
			logo: 'puzzle'
		},
		{
			name: 'consumers',
			displayedFields: ['username', 'custom_id', 'updated_at'],
			apiPath: 'consumers',
			defaultAddValue: {
				username: '',
				custom_id: ''
			},
			uiSpaceAfter: true,
			logo: 'user_group'
		},
		{
			name: 'certificates',
			displayedFields: ['id', 'tags', 'updated_at'],
			apiPath: 'certificates'
		},
		{
			name: 'ca_certificates',
			displayedFields: ['id', 'tags', 'updated_at'],
			apiPath: 'ca_certificates'
		},
		{
			name: 'upstreams',
			displayedFields: ['name', 'updated_at'],
			subEntities: ['targets'],
			apiPath: 'upstreams',
			defaultAddValue: {
				name: ''
			}
		},
		{
			name: 'targets',
			displayedFields: ['target', 'weight', 'updated_at'],
			apiPath: 'targets',
			showInMenu: false
		},
		{ name: 'keys', displayedFields: ['name', 'kid', 'updated_at'], apiPath: 'keys' },
		{
			name: 'key-sets',
			displayedFields: ['name', 'id', 'updated_at'],
			subEntities: ['keys'],
			apiPath: 'key-sets',
			defaultAddValue: { name: 'my_keyset_name' }
		},
		{ name: 'snis', displayedFields: undefined, apiPath: 'snis' },
		{
			name: 'vaults',
			displayedFields: ['prefix', 'name', 'config', 'tags'],
			apiPath: 'vaults'
		},
		{
			name: 'dataplanes',
			displayedFields: ['hostname', 'last_seen', 'labels', 'sync_status', 'version', 'config_hash'],
			apiPath: 'clustering/data-planes',
			uiSpaceAfter: true,
			sortBy: 'last_seen',
			uiSpaceBefore: true
		}
	];

	const defaultPref: { [key: string]: any } = {
		version: 5.4,
		loadParentInfo: false,
		paginationSizeUi: 20,
		paginationSizeApi: 1000,
		showPluginOrder: false,
		useNewSearch: false,
		useEphemeralGetRequestsCache: true,
		sortSearchedItemsDuringPaginationProcess: false,
		showDeleteAllButton: false,
		paginationRequestsDelayMs: 0,
		kongEntities: kongEntities
	};

	const localCacheKey = 'preferences';
	onMount(async () => {
		let prefObject: { [key: string]: any } = {};
		let localStoragePref = localStorage.getItem(localCacheKey);
		if (localStoragePref) {
			try {
				prefObject = JSON.parse(localStoragePref);
			} catch (error) {
				prefObject = JSON.parse(JSON.stringify(defaultPref));
			}
		}
		if (!prefObject.version || prefObject.version < defaultPref.version) {
			for (const key of Object.keys(prefObject)) {
				if (!defaultPref[key]) {
					prefObject[key] = undefined;
				}
			}
			for (const key of Object.keys(defaultPref)) {
				if (!prefObject[key] || typeof prefObject[key] != typeof defaultPref[key]) {
					prefObject[key] = defaultPref[key];
				}
			}
			(prefObject.version = defaultPref.version),
				localStorage.setItem(localCacheKey, JSON.stringify(prefObject));
		}
		setPreferences(getPreferencesObject(prefObject));
		if (preferences) {
			for (const key of Object.keys(preferences)) {
				preferences[key].subscribe((v) => {
					savePreferences();
				});
			}
		}
	});
</script>
