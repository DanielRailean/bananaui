import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';
import { goto } from '$app/navigation';
import { get } from 'svelte/store';
import { config, userToken } from './stores';
import { delay } from './util';

class ApiService {
	instance: AxiosInstance;
	endpoint: string;

	constructor(endpoint: string, token?: string) {
		this.instance = axios.create({
			timeout: 30000,
			headers: {
				Authorization: token ? `Bearer ${token}`: undefined
			}
		});
		this.endpoint = endpoint;
	}

	getInfo() {
		return this.instance.get(`${this.endpoint}`);
	}

	// entity-specific methods
	findAll<T>(entity: string, params: Record<string, unknown>) {
		return this.instance.get<T>(`${this.endpoint}/${entity}`, { params });
	}

	findRecord<T>(entity: string, id: string) {
		return this.instance.get<T>(`${this.endpoint}/${entity}/${id}`);
	}

	createRecord(entity: string, data: Record<string, unknown>) {
		return this.instance.post(`${this.endpoint}/${entity}`, data);
	}

	updateRecord(entity: string, id: string, data: Record<string, unknown>) {
		return this.instance.patch(`${this.endpoint}/${entity}/${id}`, data);
	}

	deleteRecord(entity: string, id: string) {
		return this.instance.delete(`${this.endpoint}/${entity}/${id}`);
	}

	// generic methods
	get<T>(url = '', config: AxiosRequestConfig = {}) {
		return this.instance.get<T>(`${this.endpoint}/${url}`, config);
	}

	post(url = '', data?: Record<string, unknown>, config: AxiosRequestConfig = {}) {
		return this.instance.post(`${this.endpoint}/${url}`, data, config);
	}

	put(url = '', data?: Record<string, unknown>, config: AxiosRequestConfig = {}) {
		return this.instance.put(`${this.endpoint}/${url}`, data, config);
	}

	patch(url = '', data?: Record<string, unknown>, config: AxiosRequestConfig = {}) {
		return this.instance.patch(`${this.endpoint}/${url}`, data, config);
	}

	delete(url = '', config: AxiosRequestConfig = {}) {
		return this.instance.delete(`${this.endpoint}/${url}`, config);
	}
	getUrl() {
		return this.endpoint;
	}
	setToken(token: string) {
		this
	}
}

let apiInstance: ApiService | undefined
const maxRetries = 3

export let apiService = async (retryNo? : number): Promise<ApiService> => {
	if(retryNo && retryNo > maxRetries)
	{
		throw new Error("retries exceeded")
	}
	if(apiInstance)
		{
			return apiInstance
		}
	const token = get(userToken)
	const conf = get(config)
	if(!conf)
		{
			await delay(500)
			return await apiService(retryNo ? retryNo + 1 : 0)
		}
	if(!token && conf.auth.enabled)
		{
			goto("/login")
			throw new Error("no token")
		}
	apiInstance = new ApiService(conf.kongApi.endpoint, token)
	return apiInstance
}
