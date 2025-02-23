export interface IEntityBase {
	id: string;
}

export interface IPaginationRes {
	next?: string;
	offset?: string;
	data: any[];
}

export interface IKongService extends IEntityBase {
	created_at: number;
	updated_at: number;
	retries: number;
	path: string;
	port: number;
	enabled: boolean;
	tls_verify: boolean;
	// client_certificate: null;
	// tls_verify_depth:   null;
	connect_timeout: number;
	protocol: string;
	write_timeout: number;
	// ca_certificates:    null;
	host: string;
	tags: string[];
	read_timeout: number;
	name: string;
}

export interface IKongUpstream {
	created_at: number;
	updated_at: number;
	id:         string;
	tags:       string[];
	upstream:   IEntityBase;
	target:     string;
	weight:     number;
}

export interface IConfig {
	kongApi: {
		endpoint: string;
		requestHeaders: Record<string, string>;
	};
	oidc?: IOidc;
}

export interface IConfigWrap {
	config: IConfig;
	source: 'local' | 'remote';
}

export interface IOidc {
	enabled: boolean;
	autoLogin: boolean;
	authorizeEndpoint: string;
	clientId: string;
	selfUrl: string;
	scope: string;
	responseType: string;
	response_mode: string;
}

export interface IToast {
	id?: number;
	type?: 'error' | 'info' | 'success';
	dismissible?: boolean;
	timeout?: number;
	message: string;
}

export interface IKongEntity {
	name: string;
	apiPath: string;
	sortBy?: string;
	sortAscending?: boolean;
	displayedFields?: string[];
	defaultAddValue?: any;
	subEntities?: string[];
	uiSpaceAfter?: boolean;
	uiSpaceBefore?: boolean;
	showInMenu?: boolean
}

export interface  IUserPreferences {
	loadParentInfo: boolean;
};
