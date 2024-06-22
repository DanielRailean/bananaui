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
