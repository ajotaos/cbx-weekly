import type { Publisher } from './types/publisher';

import type { AxiosInstance } from 'axios';

import type { UndefinedOnPartialDeep } from 'type-fest';

export async function listPublishers(
	props: ListPublishers.Props,
	baseUrl: string,
	axios: AxiosInstance,
) {
	const url = new URL(baseUrl);
	url.pathname = '/list-publishers';

	if (props.cursor !== undefined) {
		url.searchParams.set('cursor', props.cursor);
	}

	if (props.order !== undefined) {
		url.searchParams.set('order', props.order);
	}

	if (props.limit !== undefined) {
		url.searchParams.set('limit', String(props.limit));
	}

	const response = await axios.request<ListPublishers.Response>({
		method: 'GET',
		url: url.toString(),
	});

	return response.data;
}

export declare namespace ListPublishers {
	export type Props = UndefinedOnPartialDeep<
		Partial<{
			cursor: string;
			order: 'asc' | 'desc';
			limit: number;
		}>
	>;

	export type Response = {
		results: Array<Publisher>;
		cursor?: string;
	};
}
