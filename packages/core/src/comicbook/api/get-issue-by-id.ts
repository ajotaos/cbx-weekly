import type { Issue } from './types/issue';

import type { AxiosInstance } from 'axios';

export async function getIssueById(
	props: GetIssueById.Props,
	baseUrl: string,
	axios: AxiosInstance,
) {
	const url = new URL(baseUrl);
	url.pathname = '/get-issue-by-id';

	url.searchParams.set('id', props.id);

	const response = await axios.request<GetIssueById.Response>({
		method: 'GET',
		url: url.toString(),
	});

	return response.data;
}

export declare namespace GetIssueById {
	export type Props = {
		id: string;
	};

	export type Response = {
		result: Issue;
	};
}
