import { goto } from '$app/navigation';
import { get } from 'svelte/store';
import { config, preferences, userToken } from './stores';
import { addToast } from './toastStore';
import { delay } from './util';
import type { IEntityBase, IPaginationRes } from './types';
import type { IRootRes, IResCreateError, ISchemaRes, IPluginConfig } from './responseTypes';
import { base } from '$app/paths';
import { DateTime } from 'luxon';

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

async function requestWithResponseBody<ResType, ErrType = void>(
	url: string,
	method: string = 'GET',
	body?: object,
	headers?: Record<string, string>
): Promise<ResWrapped<ResType, ErrType>> {
	const res = await request(url, method, body, headers);
	const result: ResWrapped<ResType, ErrType> = {
		ok: res.ok,
		code: res.status
	};
	if (res.ok) {
		try {
			result.data = (await res.json()) as ResType;
		} catch {}
	} else {
		result.err = await res.text();
		try {
			result.errTyped = JSON.parse(result.err) as ErrType;
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
			`${this.endpoint}${pathPrefix}/${entity}?size=${get(preferences.paginationSizeApi)}&sort_by=updated_at`,
			undefined,
			undefined,
			this.headers
		);
	}

	findRecord<T>(entity: string, id: string, pathPrefix: string = '') {
		return requestWithResponseBody<T>(
			`${this.endpoint}${pathPrefix}/${entity}/${id}`,
			undefined,
			undefined,
			this.headers
		);
	}

	createRecord(entity: string, data: Record<string, unknown>, pathPrefix: string = '') {
		return requestWithResponseBody<IEntityBase, IResCreateError>(
			`${this.endpoint}${pathPrefix}/${entity}`,
			'POST',
			data,
			this.headers
		);
	}

	updateRecord<T = any>(entity: string, id: string, data: Record<string, unknown>, pathPrefix: string = '') {
		return requestWithResponseBody<T>(`${this.endpoint}${pathPrefix}/${entity}/${id}`, 'PATCH', data, this.headers);
	}

	deleteRecord(entity: string, id: string, pathPrefix: string = '') {
		return requestWithResponseBody(
			`${this.endpoint}${pathPrefix}/${entity}/${id}`,
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
	const token = get(userToken);
	if(token && DateTime.now().toUnixInteger() > token.expires)
	{
		userToken.set(undefined)
		goto(`${base}/login?auto=true`);
	}
	if (apiInstance) {
		return apiInstance;
	}
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
	apiInstance = new ApiService(conf.kongApi.endpoint, token?.token, conf.kongApi.requestHeaders);
	return apiInstance;
};