import type { AxiosInstance } from 'axios';

export async function updateIssuePagesetId(
	props: UpdateIssuePagesetId.Props,
	baseUrl: string,
	axios: AxiosInstance,
) {
	const url = new URL(baseUrl);
	url.pathname = '/update-issue-pageset-id';

	const response = await axios.request<UpdateIssuePagesetId.Response>({
		method: 'POST',
		url: url.toString(),
		data: JSON.stringify(props),
		headers: {
			'Content-Type': 'application/json',
		},
	});

	return response.data;
}

export declare namespace UpdateIssuePagesetId {
	export type Props = {
		id: string;
		pagesetId: string;
	};

	export type Response = null;
}
