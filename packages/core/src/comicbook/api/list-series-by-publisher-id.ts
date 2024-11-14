import type { Series } from './types/series';

import type { AxiosInstance } from 'axios';

import type { Simplify, UndefinedOnPartialDeep } from 'type-fest';

export async function listSeriesByPublisherId(
	props: ListSeriesByPublisherId.Props,
	baseUrl: string,
	axios: AxiosInstance,
) {
	const url = new URL(baseUrl);
	url.pathname = '/list-series-by-publisher-id';

	url.searchParams.set('publisher-id', props.publisherId);

	if (props.cursor !== undefined) {
		url.searchParams.set('cursor', props.cursor);
	}

	if (props.order !== undefined) {
		url.searchParams.set('order', props.order);
	}

	if (props.limit !== undefined) {
		url.searchParams.set('limit', String(props.limit));
	}

	const response = await axios.request<ListSeriesByPublisherId.Response>({
		method: 'GET',
		url: url.toString(),
	});

	return response.data;
}

export declare namespace ListSeriesByPublisherId {
	export type Props = Simplify<
		{ publisherId: string } & UndefinedOnPartialDeep<
			Partial<{
				cursor: string;
				order: 'asc' | 'desc';
				limit: number;
			}>
		>
	>;

	export type Response = {
		results: Array<Series>;
		cursor?: string;
	};
}
