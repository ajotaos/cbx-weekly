import type { Series } from './types/series';

import type { AxiosInstance } from 'axios';

export async function getSeriesByTitle(
	props: GetSeriesByTitle.Props,
	baseUrl: string,
	axios: AxiosInstance,
) {
	const url = new URL(baseUrl);
	url.pathname = '/get-series-by-title';

	url.searchParams.set('publisher', props.title.publisher);
	url.searchParams.set('name', props.title.name);

	const response = await axios.request<GetSeriesByTitle.Response>({
		method: 'GET',
		url: url.toString(),
	});

	return response.data;
}

export declare namespace GetSeriesByTitle {
	export type Props = {
		title: {
			publisher: string;
			name: string;
		};
	};

	export type Response = {
		result: Series;
	};
}
