import type { IKongService } from './types';

export type GetAllServices = {
	data: IKongService[];
	next: [];
};

export type Error = {
	message: string;
	code: number;
	fields: Record<string, string>;
	name: string;
};
