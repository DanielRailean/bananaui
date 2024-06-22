export interface IEntityBase {
	id: string;
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

export interface IConfig {
	auth: {
		enabled: boolean;
	};
	kongApi: {
		endpoint: string;
		requestHeaders: Record<string, string>;
	};
	oidc: IOidc;
}

export interface IOidc {
	authorizeEndpoint: string;
	clientId: string;
	selfUrl: string;
	scope: string;
	responseType: string;
	response_mode: string;
}

export interface IToast {
	id?: number;
	type?: 'error' | 'info' | '';
	dismissible?: boolean;
	timeout?: number;
	message: string;
}

export interface IKongEntity {
	name: string;
	apiPath: string;
	displayedFields: string[];
	defaultJson?: string;
	subEntities?: string[];
}
