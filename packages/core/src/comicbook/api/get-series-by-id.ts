import type { Series } from './types/series';

import type { AxiosInstance } from 'axios';

export async function getSeriesById(
	props: GetSeriesById.Props,
	baseUrl: string,
	axios: AxiosInstance,
) {
	const url = new URL(baseUrl);
	url.pathname = '/get-series-by-id';

	url.searchParams.set('id', props.id);

	const response = await axios.request<GetSeriesById.Response>({
		method: 'GET',
		url: url.toString(),
	});

	return response.data;
}

export declare namespace GetSeriesById {
	export type Props = {
		id: string;
	};

	export type Response = {
		result: Series;
	};
}
