import type { AxiosInstance } from 'axios';

import type { UndefinedOnPartialDeep } from 'type-fest';

export async function listPublishers(
	props: ListPublishers.Props,
	axios: AxiosInstance,
) {
	// biome-ignore lint/style/noNonNullAssertion: <explanation>
	const url = new URL(axios.defaults.baseURL!);
	url.pathname = '/list-publishers';

	if (props.cursor !== undefined) {
		url.searchParams.set('cursor', props.cursor);
	}

	if (props.order !== undefined) {
		url.searchParams.set('order', props.order);
	}

	if (props.limit !== undefined) {
		url.searchParams.set('limit', String(props.limit));
	}

	const response = await axios.request({
		method: 'GET',
		url: url.toString(),
	});

	return response.data;
}

export declare namespace ListPublishers {
	export type Props = UndefinedOnPartialDeep<
		Partial<{
			cursor: string;
			order: 'asc' | 'desc';
			limit: number;
		}>
	>;

	// export type Response = {
	// 		results: Array<Publisher>
	// 		cursor?: string | undefined;
	// 	}
}
