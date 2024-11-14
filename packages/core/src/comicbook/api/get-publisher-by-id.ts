import type { Publisher } from './types/publisher';

import type { AxiosInstance } from 'axios';

export async function getPublisherById(
	props: GetPublisherById.Props,
	baseUrl: string,
	axios: AxiosInstance,
) {
	const url = new URL(baseUrl);
	url.pathname = '/get-publisher-by-id';

	url.searchParams.set('id', props.id);

	const response = await axios.request<GetPublisherById.Response>({
		method: 'GET',
		url: url.toString(),
	});

	return response.data;
}

export declare namespace GetPublisherById {
	export type Props = {
		id: string;
	};

	export type Response = {
		result: Publisher;
	};
}
