import {
	makeIssueGsi3Cursor,
	makeIssueGsi3PartitionKey,
	makeIssueGsi3SortKey,
	makeIssuePk,
	makeIssueSk,
} from './keys/issue';
import {
	issueGsi3CursorSchema,
	issueGsi3KeysSchema,
	issueSchema,
} from './types/issue';

import { Dynamodb } from '@cbx-weekly/utils/dynamodb';

import * as v from '@cbx-weekly/valibot/core';

import type { DynamoDBClient } from '@aws-sdk/client-dynamodb';

import type { Simplify, UndefinedOnPartialDeep } from 'type-fest';

export async function queryIssuesByReleaseWeek(
	props: QueryIssuesByReleaseWeek.Props,
	tableName: string,
	client: DynamoDBClient,
) {
	return Dynamodb.queryItems(
		client,
		{
			tableName,
			indexName: 'Gsi3',
			keyCondition: '#gsi3pk = :gsi3pk AND begins_with(#gsi3sk, :gsi3sk)',
			attributes: {
				names: {
					'#gsi3pk': 'Gsi3Pk',
					'#gsi3sk': 'Gsi3Sk',
				},
				values: {
					':gsi3pk': makeIssueGsi3PartitionKey({
						releaseWeek: props.releaseWeek,
					}),
					':gsi3sk': makeIssueGsi3SortKey({ releaseWeekday: '', slug: '' }),
				},
			},
			cursor: props.cursor,
			order: props.order,
			limit: props.limit,
			consistentRead: props.consistentRead,
		},
		issueSchema,
		v.pipe(
			issueGsi3CursorSchema,
			v.transform((props) => ({
				Pk: makeIssuePk({ id: props.id }),
				Sk: makeIssueSk(),
				Gsi3Pk: makeIssueGsi3PartitionKey({
					releaseWeek: props.releaseDate.substring(0, 8),
				}),
				Gsi3Sk: makeIssueGsi3SortKey({
					releaseWeekday: props.releaseDate.substring(9),
					slug: props.slug,
				}),
			})),
		),
		v.pipe(issueGsi3KeysSchema, v.transform(makeIssueGsi3Cursor)),
	);
}

export declare namespace QueryIssuesByReleaseWeek {
	type Props = Simplify<
		{ releaseWeek: string } & UndefinedOnPartialDeep<
			Partial<{
				cursor: string;
				order: 'asc' | 'desc';
				limit: number;
				consistentRead: boolean;
			}>
		>
	>;
}
