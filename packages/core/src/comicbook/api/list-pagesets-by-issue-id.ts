import type { Issue } from './types/issue';

import type { AxiosInstance } from 'axios';

import type { Simplify, UndefinedOnPartialDeep } from 'type-fest';

export async function listPagesetsByIssueId(
	props: ListPagesetsByIssueId.Props,
	baseUrl: string,
	axios: AxiosInstance,
) {
	const url = new URL(baseUrl);
	url.pathname = '/list-pagesets-by-issue-id';

	url.searchParams.set('issue-id', props.seriesId);

	if (props.cursor !== undefined) {
		url.searchParams.set('cursor', props.cursor);
	}

	if (props.order !== undefined) {
		url.searchParams.set('order', props.order);
	}

	if (props.limit !== undefined) {
		url.searchParams.set('limit', String(props.limit));
	}

	const response = await axios.request<ListPagesetsByIssueId.Response>({
		method: 'GET',
		url: url.toString(),
	});

	return response.data;
}

export declare namespace ListPagesetsByIssueId {
	export type Props = Simplify<
		{ seriesId: string } & UndefinedOnPartialDeep<
			Partial<{
				cursor: string;
				order: 'asc' | 'desc';
				limit: number;
			}>
		>
	>;

	export type Response = {
		results: Array<Issue>;
		cursor?: string;
	};
}
