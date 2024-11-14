import type { Issue } from './types/issue';

import type { AxiosInstance } from 'axios';

export async function getIssueBySlug(
	props: GetIssueBySlug.Props,
	baseUrl: string,
	axios: AxiosInstance,
) {
	const url = new URL(baseUrl);
	url.pathname = '/get-issue-by-slug';

	url.searchParams.set('slug', props.slug);

	const response = await axios.request<GetIssueBySlug.Response>({
		method: 'GET',
		url: url.toString(),
	});

	return response.data;
}

export declare namespace GetIssueBySlug {
	export type Props = {
		slug: string;
	};

	export type Response = {
		result: Issue;
	};
}
