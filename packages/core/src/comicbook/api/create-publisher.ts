import type { Publisher } from './types/publisher';

import type { AxiosInstance } from 'axios';

export async function createPublisher(
	props: CreatePublisher.Props,
	baseUrl: string,
	axios: AxiosInstance,
) {
	const url = new URL(baseUrl);
	url.pathname = '/create-publisher';

	const response = await axios.request<CreatePublisher.Response>({
		method: 'POST',
		url: url.toString(),
		data: JSON.stringify(props),
		headers: {
			'Content-Type': 'application/json',
		},
	});

	return response.data;
}

export declare namespace CreatePublisher {
	export type Props = {
		title: {
			name: string;
		};
	};

	export type Response = {
		result: Pick<Publisher, 'id'>;
	};
}
