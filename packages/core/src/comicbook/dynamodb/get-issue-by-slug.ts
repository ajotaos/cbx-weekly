import { makeIssueGsi1Pk, makeIssueGsi1Sk } from './keys/issue';
import { issueSchema } from './types/issue';

import { Dynamodb } from '@cbx-weekly/utils/dynamodb';

import * as v from '@cbx-weekly/valibot/core';

import type { DynamoDBClient } from '@aws-sdk/client-dynamodb';

import type { Simplify, UndefinedOnPartialDeep } from 'type-fest';

export async function getIssueBySlug(
	props: GetIssueBySlug.Props,
	tableName: string,
	client: DynamoDBClient,
) {
	return Dynamodb.queryItems(
		client,
		{
			tableName,
			indexName: 'Gsi1',
			keyCondition: '#gsi1pk = :gsi1pk AND #gsi1sk = :gsi1sk',
			attributes: {
				names: {
					'#gsi1pk': 'Gsi1Pk',
					'#gsi1sk': 'Gsi1Sk',
				},
				values: {
					':gsi1pk': makeIssueGsi1Pk({ slug: props.slug }),
					':gsi1sk': makeIssueGsi1Sk(),
				},
			},
			limit: 1,
			consistentRead: props.consistentRead,
		},
		issueSchema,
		v.any(),
		v.any(),
	).then((output) => {
		if (output.items.length === 0) {
			throw Dynamodb.Errors.itemNotFound.make('issue', {
				slug: props.slug,
			});
		}

		return { item: output.items[0] };
	});
}

export declare namespace GetIssueBySlug {
	type Props = Simplify<
		{ slug: string } & UndefinedOnPartialDeep<
			Partial<{
				consistentRead: boolean;
			}>
		>
	>;
}
