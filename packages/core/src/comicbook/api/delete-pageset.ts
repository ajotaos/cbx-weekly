import type { AxiosInstance } from 'axios';

export async function deletePageset(
	props: DeletePageset.Props,
	baseUrl: string,
	axios: AxiosInstance,
) {
	const url = new URL(baseUrl);
	url.pathname = '/delete-pageset';

	const response = await axios.request<DeletePageset.Response>({
		method: 'POST',
		url: url.toString(),
		data: JSON.stringify(props),
		headers: {
			'Content-Type': 'application/json',
		},
	});

	return response.data;
}

export declare namespace DeletePageset {
	export type Props = {
		id: string;
	};

	export type Response = null;
}
