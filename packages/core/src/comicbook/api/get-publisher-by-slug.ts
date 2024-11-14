import type { Publisher } from './types/publisher';

import type { AxiosInstance } from 'axios';

export async function getPublisherBySlug(
	props: GetPublisherBySlug.Props,
	baseUrl: string,
	axios: AxiosInstance,
) {
	const url = new URL(baseUrl);
	url.pathname = '/get-publisher-by-slug';

	url.searchParams.set('slug', props.slug);

	const response = await axios.request<GetPublisherBySlug.Response>({
		method: 'GET',
		url: url.toString(),
	});

	return response.data;
}

export declare namespace GetPublisherBySlug {
	export type Props = {
		slug: string;
	};

	export type Response = {
		result: Publisher;
	};
}
