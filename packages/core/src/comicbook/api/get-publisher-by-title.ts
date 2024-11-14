import type { Publisher } from './types/publisher';

import type { AxiosInstance } from 'axios';

export async function getPublisherByTitle(
	props: GetPublisherByTitle.Props,
	baseUrl: string,
	axios: AxiosInstance,
) {
	const url = new URL(baseUrl);
	url.pathname = '/get-publisher-by-title';

	url.searchParams.set('name', props.title.name);

	const response = await axios.request<GetPublisherByTitle.Response>({
		method: 'GET',
		url: url.toString(),
	});

	return response.data;
}

export declare namespace GetPublisherByTitle {
	export type Props = {
		title: {
			name: string;
		};
	};

	export type Response = {
		result: Publisher;
	};
}
