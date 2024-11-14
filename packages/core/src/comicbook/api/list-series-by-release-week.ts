import type { Series } from './types/series';

import type { AxiosInstance } from 'axios';

import type { Simplify, UndefinedOnPartialDeep } from 'type-fest';

export async function listSeriesByReleaseWeek(
	props: ListSeriesByReleaseWeek.Props,
	baseUrl: string,
	axios: AxiosInstance,
) {
	const url = new URL(baseUrl);
	url.pathname = '/list-series-by-release-week';

	url.searchParams.set('release-week', props.releaseWeek);

	if (props.cursor !== undefined) {
		url.searchParams.set('cursor', props.cursor);
	}

	if (props.order !== undefined) {
		url.searchParams.set('order', props.order);
	}

	if (props.limit !== undefined) {
		url.searchParams.set('limit', String(props.limit));
	}

	const response = await axios.request<ListSeriesByReleaseWeek.Response>({
		method: 'GET',
		url: url.toString(),
	});

	return response.data;
}

export declare namespace ListSeriesByReleaseWeek {
	export type Props = Simplify<
		{ releaseWeek: string } & UndefinedOnPartialDeep<
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
