import type { Pageset } from './types/pageset';

import type { AxiosInstance } from 'axios';

export async function createPageset(
	props: CreatePageset.Props,
	baseUrl: string,
	axios: AxiosInstance,
) {
	const url = new URL(baseUrl);
	url.pathname = '/create-pageset';

	const response = await axios.request<CreatePageset.Response>({
		method: 'POST',
		url: url.toString(),
		data: JSON.stringify(props),
		headers: {
			'Content-Type': 'application/json',
		},
	});

	return response.data;
}

export declare namespace CreatePageset {
	export type Props = {
		issueId: string;
	};

	export type Response = {
		result: Pick<Pageset, 'id'>;
		upload: { url: string };
	};
}
