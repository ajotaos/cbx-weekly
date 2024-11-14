import { makeIssuePk, makeIssueSk } from './keys/issue';
import { issueSchema } from './types/issue';

import { Dynamodb } from '@cbx-weekly/utils/dynamodb';

import type { DynamoDBClient } from '@aws-sdk/client-dynamodb';

import type { Simplify, UndefinedOnPartialDeep } from 'type-fest';

export async function getIssueById(
	props: GetIssueById.Props,
	tableName: string,
	client: DynamoDBClient,
) {
	return Dynamodb.getItem(
		client,
		{
			tableName,
			key: {
				Pk: makeIssuePk({ id: props.id }),
				Sk: makeIssueSk(),
			},
			consistentRead: props.consistentRead,
		},
		issueSchema,
	).then((output) => {
		if (output.item === undefined) {
			throw Dynamodb.Errors.itemNotFound.make('issue', { id: props.id });
		}

		return { item: output.item };
	});
}

export declare namespace GetIssueById {
	type Props = Simplify<
		{ id: string } & UndefinedOnPartialDeep<
			Partial<{
				consistentRead: boolean;
			}>
		>
	>;
}
