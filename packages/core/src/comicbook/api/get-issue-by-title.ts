import type { Issue } from './types/issue';

import type { AxiosInstance } from 'axios';

export async function getIssueByTitle(
	props: GetIssueByTitle.Props,
	baseUrl: string,
	axios: AxiosInstance,
) {
	const url = new URL(baseUrl);
	url.pathname = '/get-issue-by-title';

	url.searchParams.set('publisher', props.title.publisher);
	url.searchParams.set('series', props.title.series);
	url.searchParams.set('number', props.title.number);

	const response = await axios.request<GetIssueByTitle.Response>({
		method: 'GET',
		url: url.toString(),
	});

	return response.data;
}

export declare namespace GetIssueByTitle {
	export type Props = {
		title: {
			publisher: string;
			series: string;
			number: string;
		};
	};

	export type Response = {
		result: Issue;
	};
}
