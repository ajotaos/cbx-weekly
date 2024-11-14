import {
	makeIssueGsi2Cursor,
	makeIssueGsi2Pk,
	makeIssueGsi2Sk,
	makeIssuePk,
	makeIssueSk,
} from './keys/issue';
import {
	issueGsi2CursorSchema,
	issueGsi2KeysSchema,
	issueSchema,
} from './types/issue';

import { Dynamodb } from '@cbx-weekly/utils/dynamodb';

import * as v from '@cbx-weekly/valibot/core';

import type { DynamoDBClient } from '@aws-sdk/client-dynamodb';

import type { Simplify, UndefinedOnPartialDeep } from 'type-fest';

export async function queryIssuesBySeriesId(
	props: QueryIssuesBySeriesId.Props,
	tableName: string,
	client: DynamoDBClient,
) {
	return Dynamodb.queryItems(
		client,
		{
			tableName,
			indexName: 'Gsi2',
			keyCondition: '#gsi2pk = :gsi2pk AND begins_with(#gsi2sk, :gsi2sk)',
			attributes: {
				names: {
					'#gsi2pk': 'Gsi2Pk',
					'#gsi2sk': 'Gsi2Sk',
				},
				values: {
					':gsi2pk': makeIssueGsi2Pk({
						seriesId: props.seriesId,
					}),
					':gsi2sk': makeIssueGsi2Sk({ slug: '' }),
				},
			},
			cursor: props.cursor,
			order: props.order,
			limit: props.limit,
			consistentRead: props.consistentRead,
		},
		issueSchema,
		v.pipe(
			issueGsi2CursorSchema,
			v.transform((props) => ({
				Pk: makeIssuePk({ id: props.id }),
				Sk: makeIssueSk(),
				Gsi2Pk: makeIssueGsi2Pk({ seriesId: props.seriesId }),
				Gsi2Sk: makeIssueGsi2Sk({ slug: props.slug }),
			})),
		),
		v.pipe(issueGsi2KeysSchema, v.transform(makeIssueGsi2Cursor)),
	);
}

export declare namespace QueryIssuesBySeriesId {
	type Props = Simplify<
		{ seriesId: string } & UndefinedOnPartialDeep<
			Partial<{
				cursor: string;
				order: 'asc' | 'desc';
				limit: number;
				consistentRead: boolean;
			}>
		>
	>;
}
