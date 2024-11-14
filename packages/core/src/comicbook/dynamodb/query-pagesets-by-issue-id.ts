import {
	makePagesetGsi1Cursor,
	makePagesetGsi1Pk,
	makePagesetGsi1Sk,
	makePagesetPk,
	makePagesetSk,
} from './keys/pageset';
import {
	pagesetGsi1CursorSchema,
	pagesetGsi1KeysSchema,
	pagesetSchema,
} from './types/pageset';

import { Dynamodb } from '@cbx-weekly/utils/dynamodb';

import * as v from '@cbx-weekly/valibot/core';

import type { DynamoDBClient } from '@aws-sdk/client-dynamodb';

import type { Simplify, UndefinedOnPartialDeep } from 'type-fest';

export async function queryPagesetsByIssueId(
	props: QueryPagesetsByIssueId.Props,
	tableName: string,
	client: DynamoDBClient,
) {
	return Dynamodb.queryItems(
		client,
		{
			tableName,
			indexName: 'Gsi1',
			keyCondition: '#gsi2pk = :gsi2pk AND begins_with(#gsi2sk, :gsi2sk)',
			attributes: {
				names: {
					'#gsi2pk': 'Gsi1Pk',
					'#gsi2sk': 'Gsi1Sk',
				},
				values: {
					':gsi2pk': makePagesetGsi1Pk({
						issueId: props.issueId,
					}),
					':gsi2sk': makePagesetGsi1Sk({ created: '' }),
				},
			},
			cursor: props.cursor,
			order: props.order,
			limit: props.limit,
			consistentRead: props.consistentRead,
		},
		pagesetSchema,
		v.pipe(
			pagesetGsi1CursorSchema,
			v.transform((props) => ({
				Pk: makePagesetPk({ id: props.id }),
				Sk: makePagesetSk(),
				Gsi1Pk: makePagesetGsi1Pk({ issueId: props.issueId }),
				Gsi1Sk: makePagesetGsi1Sk({ created: props.created }),
			})),
		),
		v.pipe(pagesetGsi1KeysSchema, v.transform(makePagesetGsi1Cursor)),
	);
}

export declare namespace QueryPagesetsByIssueId {
	type Props = Simplify<
		{ issueId: string } & UndefinedOnPartialDeep<
			Partial<{
				cursor: string;
				order: 'asc' | 'desc';
				limit: number;
				consistentRead: boolean;
			}>
		>
	>;
}
