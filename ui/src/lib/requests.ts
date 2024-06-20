import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';
import { config } from './stores';
import { userToken } from './stores';

class ApiService {
	instance: AxiosInstance;
	endpoint: string;

	constructor(endpoint: string, token: string) {
		this.instance = axios.create({
			timeout: 30000,
			headers: {
				Authorization: `Bearer ${token}`
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



export let apiService = new ApiService('https://example.com', '');
config.subscribe((v) => {
	if (v) {
		apiService = new ApiService(v.kongApi.endpoint, '');
	}
});
userToken.subscribe((v) => {
	if (v) {
		apiService = new ApiService(apiService.getUrl(), v);
	}
});
