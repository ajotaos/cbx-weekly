import type { Issue } from './types/issue';

import type { AxiosInstance } from 'axios';

export async function createIssue(
	props: CreateIssue.Props,
	baseUrl: string,
	axios: AxiosInstance,
) {
	const url = new URL(baseUrl);
	url.pathname = '/create-issue';

	const response = await axios.request<CreateIssue.Response>({
		method: 'POST',
		url: url.toString(),
		data: JSON.stringify(props),
		headers: {
			'Content-Type': 'application/json',
		},
	});

	return response.data;
}

export declare namespace CreateIssue {
	export type Props = {
		title: {
			publisher: string;
			series: string;
			number: string;
		};
		releaseDate: string;
		seriesId: string;
	};

	export type Response = {
		result: Pick<Issue, 'id'>;
	};
}
