import type { Series } from './types/series';

import type { AxiosInstance } from 'axios';

export async function createSeries(
	props: CreateSeries.Props,
	baseUrl: string,
	axios: AxiosInstance,
) {
	const url = new URL(baseUrl);
	url.pathname = '/create-series';

	const response = await axios.request<CreateSeries.Response>({
		method: 'POST',
		url: url.toString(),
		data: JSON.stringify(props),
		headers: {
			'Content-Type': 'application/json',
		},
	});

	return response.data;
}

export declare namespace CreateSeries {
	export type Props = {
		title: {
			publisher: string;
			name: string;
		};
		releaseDate: string;
		publisherId: string;
	};

	export type Response = {
		result: Pick<Series, 'id'>;
	};
}
