import type { Pageset } from './types/pageset';

import type { AxiosInstance } from 'axios';

export async function getPagesetById(
	props: GetPagesetById.Props,
	baseUrl: string,
	axios: AxiosInstance,
) {
	const url = new URL(baseUrl);
	url.pathname = '/get-pageset-by-id';

	url.searchParams.set('id', props.id);

	const response = await axios.request<GetPagesetById.Response>({
		method: 'GET',
		url: url.toString(),
	});

	return response.data;
}

export declare namespace GetPagesetById {
	export type Props = {
		id: string;
	};

	export type Response = {
		result: Pageset;
	};
}
