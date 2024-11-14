import type { Series } from './types/series';

import type { AxiosInstance } from 'axios';

export async function getSeriesBySlug(
	props: GetSeriesBySlug.Props,
	baseUrl: string,
	axios: AxiosInstance,
) {
	const url = new URL(baseUrl);
	url.pathname = '/get-series-by-slug';

	url.searchParams.set('slug', props.slug);

	const response = await axios.request<GetSeriesBySlug.Response>({
		method: 'GET',
		url: url.toString(),
	});

	return response.data;
}

export declare namespace GetSeriesBySlug {
	export type Props = {
		slug: string;
	};

	export type Response = {
		result: Series;
	};
}
