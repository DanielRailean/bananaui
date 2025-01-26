import { goto } from '$app/navigation';
import { get } from 'svelte/store';
import { config, userToken } from './stores';
import { addToast } from './toastStore';
import { delay } from './util';
import type { IEntityBase, IPaginationRes } from './types';
import type { IRootRes, IResCreateError, ISchemaRes, IPluginConfig } from './responseTypes';
import { paginationSize } from './config';
import { base } from '$app/paths';

function request(
	url: string,
	method: string = 'GET',
	body?: object,
	headers?: Record<string, string>
) {
	if (!headers) {
		headers = {};
	}
	if (body) {
		headers['content-type'] = 'application/json';
	}

	const opts = {
		method,
		headers,
		body: JSON.stringify(body)
	};

	return fetch(url, opts);
}

export type ResWrapped<T, E> = {
	ok: boolean;
	data?: T;
	err?: string;
	errTyped?: E;
	code: number;
};

async function requestWithResponseBody<T, E = void>(
	url: string,
	method: string = 'GET',
	body?: object,
	headers?: Record<string, string>
): Promise<ResWrapped<T, E>> {
	const res = await request(url, method, body, headers);
	const result: ResWrapped<T, E> = {
		ok: res.ok,
		code: res.status
	};
	if (res.ok) {
		try {
			result.data = (await res.json()) as T;
		} catch {}
	} else {
		result.err = await res.text();
		try {
			result.errTyped = JSON.parse(result.err) as E;
		} catch {}
	}
	return result;
}

class ApiService {
	endpoint: string;
	headers: Record<string, string>;

	constructor(endpoint: string, token?: string, requestHeaders?: Record<string, string>) {
		this.endpoint = endpoint;
		this.headers = {
			...requestHeaders
		};
		if (token) {
			this.headers['authorization'] = `Bearer ${token}`;
		}
	}

	getInfo() {
		return requestWithResponseBody<IRootRes>(this.endpoint, undefined, undefined, this.headers);
	}

	request<T, E = void>(
		path: string,
		method: string = 'GET',
		body?: object,
		headers: Record<string, string> = this.headers
	): Promise<ResWrapped<T, E>> {
		return requestWithResponseBody<T, E>(
			`${this.endpoint}${path.startsWith('/') ? path : `/${path}`}`,
			method,
			body,
			{
				...this.headers,
				...headers
			}
		);
	}

	// entity-specific methods
	schema(entity: string) {
		return requestWithResponseBody<ISchemaRes>(
			`${this.endpoint}/schemas/${entity}`,
			undefined,
			undefined,
			this.headers
		);
	}

	pluginConfig(pluginName: string) {
		return requestWithResponseBody<IPluginConfig>(
			`${this.endpoint}/schemas/plugins/${pluginName}`,
			undefined,
			undefined,
			this.headers
		);
	}

	// entity-specific methods
	async findAll<T extends IPaginationRes>(
		entity: string,
		params: Record<string, unknown> = {},
		pathPrefix: string = ''
	) {
		return requestWithResponseBody<T>(
			`${this.endpoint}${pathPrefix}/${entity}?size=${paginationSize}&sort_by=updated_at`,
			undefined,
			undefined,
			this.headers
		);
	}

	findRecord<T>(entity: string, id: string) {
		return requestWithResponseBody<T>(
			`${this.endpoint}/${entity}/${id}`,
			undefined,
			undefined,
			this.headers
		);
	}

	createRecord(entity: string, data: Record<string, unknown>) {
		return requestWithResponseBody<IEntityBase, IResCreateError>(
			`${this.endpoint}/${entity}`,
			'POST',
			data,
			this.headers
		);
	}

	updateRecord(entity: string, id: string, data: Record<string, unknown>) {
		return requestWithResponseBody(`${this.endpoint}/${entity}/${id}`, 'PATCH', data, this.headers);
	}

	deleteRecord(entity: string, id: string) {
		return requestWithResponseBody(
			`${this.endpoint}/${entity}/${id}`,
			'DELETE',
			undefined,
			this.headers
		);
	}
}

let apiInstance: ApiService | undefined;
const maxRetries = 3;

export let apiService = async (retryNo?: number): Promise<ApiService> => {
	if (retryNo && retryNo > maxRetries) {
		addToast({ message: `Failed to return apiService after ${maxRetries} retries` });
	}
	if (apiInstance) {
		return apiInstance;
	}
	const token = get(userToken);
	const conf = get(config)?.config;
	if (!conf) {
		await delay(200);
		return await apiService(retryNo ? retryNo + 1 : 0);
	}
	if (!token && conf.oidc?.enabled) {
		goto(`${base}/login`);
		await delay(200);
		return await apiService(retryNo ? retryNo + 1 : 0);
	}
	apiInstance = new ApiService(conf.kongApi.endpoint, token, conf.kongApi.requestHeaders);
	return apiInstance;
};

export let cache: Map<string, IEntityBase[]> = new Map();
