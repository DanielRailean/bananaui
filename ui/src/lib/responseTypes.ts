import type { IKongService } from './types';

export type GetAllServices = {
	data: IKongService[];
	next: [];
};

export type IResCreateError = {
	message: string;
	code: number;
	fields: Record<string, string>;
	name: string;
};

export interface ISchemaRes {
	entity_checks: EntityCheck[];
	fields: { [key: string]: IFieldDescription }[];
}

export interface IPluginConfig {
	entity_checks: EntityCheck[];
	fields: {
		[key: string]: {
			fields: { [key: string]: IFieldDescription }[];
		};
	}[];
}

export interface EntityCheck {
	conditional: Conditional;
}

export interface Conditional {
	if_field: string;
	then_field: string;
}

export interface IFieldDescription {
	type: string;
	description: string;
	default?: any;
	required?: boolean;
}

export interface IRootRes {
	lua_version: string;
	tagline: string;
	edition: string;
	hostname: string;
	plugins: IPlugins;
	node_id: string;
	[key: string]: any;
}

export interface IPlugins {
	available_on_server: {
		[key: string]: {
			priority: number;
			version: string;
		};
	};
	enabled_in_cluster: string[];
}
