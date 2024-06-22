import { goto } from '$app/navigation';
import { get } from 'svelte/store';
import { addToast, config, userToken } from './stores';
import { delay } from './util';
import type { IEntityBase } from './types';
import type { IResCreateError } from './responseTypes';

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

type ResWrapped<T, E> = {
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
		result.data = (await res.json()) as T;
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

	constructor(endpoint: string, token?: string) {
		this.endpoint = endpoint;
		this.headers = {};
		if (token) {
			this.headers['authorization'] = `Bearer ${token}`;
		}
	}

	getInfo() {
		return requestWithResponseBody(this.endpoint, undefined, undefined, this.headers);
	}

	// entity-specific methods
	findAll<T>(entity: string, params: Record<string, unknown>) {
		return requestWithResponseBody<T>(
			`${this.endpoint}/${entity}`,
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
	const conf = get(config);
	if (!conf) {
		await delay(200);
		return await apiService(retryNo ? retryNo + 1 : 0);
	}
	if (!token && conf.auth.enabled) {
		goto('/login');
		throw new Error('no token');
	}
	apiInstance = new ApiService(conf.kongApi.endpoint, token);
	return apiInstance;
};
