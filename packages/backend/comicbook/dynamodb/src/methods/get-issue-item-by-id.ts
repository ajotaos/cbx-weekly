import { issueTableItemSchema } from '../types';

import {
	encodeIssueTableItemPartitionKey,
	encodeIssueTableItemSortKey,
} from '../keys';

import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';

import * as v from '@cbx-weekly/backend-core-valibot';

import { throwItemNotFoundError } from '@cbx-weekly/backend-core-dynamodb';

import type { Issue } from '../types';

import type { DynamoDBClient } from '@aws-sdk/client-dynamodb';

import type { Simplify } from 'type-fest';

export async function getIssueItemByIdFromTable(
	props: GetIssueItemByIdFromTable.Props,
	tableName: string,
	client: DynamoDBClient,
) {
	const documentClient = DynamoDBDocumentClient.from(client);

	const { id, consistentRead } = parseProps(props);

	return documentClient
		.send(
			new GetCommand({
				TableName: tableName,
				Key: {
					Pk: encodeIssueTableItemPartitionKey({ id }),
					Sk: encodeIssueTableItemSortKey(),
				} satisfies Pick<Issue.TableItem.Raw, 'Pk' | 'Sk'>,
				ConsistentRead: consistentRead,
			}),
		)
		.then(({ Item }) => {
			const item = parseItem(Item);

			if (item === undefined) {
				throwItemNotFoundError('issue', { id });
			}

			return { item };
		});
}

const parseProps = v.parser(
	v.strictObject({
		id: v.pipe(v.string(), v.id()),
		consistentRead: v.optional(v.boolean()),
	}),
);

const parseItem = v.parser(v.optional(issueTableItemSchema));

export declare namespace GetIssueItemByIdFromTable {
	type Props = Simplify<
		{ id: string } & Partial<{
			consistentRead: boolean;
		}>
	>;
}
