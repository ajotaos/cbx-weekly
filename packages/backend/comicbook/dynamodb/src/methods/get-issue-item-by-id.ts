import { issueTableItemSchema } from '../types';

import {
	encodeIssueTableItemPartitionKey,
	encodeIssueTableItemSortKey,
} from '../keys';

import { throwItemNotFoundError } from '@cbx-weekly/backend-core-dynamodb';

import { GetItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

import * as vx from '@cbx-weekly/shared-valibot';
import * as v from 'valibot';

import type { IssueTableItem } from '../types';

import type { DynamoDBClient } from '@aws-sdk/client-dynamodb';

export async function getIssueItemByIdFromTable(
	props: GetIssueItemByIdFromTable.Props,
	tableName: string,
	client: DynamoDBClient,
) {
	const { id, consistentRead } = parseProps(props);

	const rawIssueItemKey = {
		Pk: encodeIssueTableItemPartitionKey({ id }),
		Sk: encodeIssueTableItemSortKey(),
	} satisfies Pick<IssueTableItem.Raw, 'Pk' | 'Sk'>;

	const { item } = await client
		.send(
			new GetItemCommand({
				TableName: tableName,
				Key: marshall(rawIssueItemKey),
				ConsistentRead: consistentRead,
			}),
		)
		.then(parseOutput);

	if (item === undefined) {
		throwItemNotFoundError('issue', { id });
	}

	return { item };
}

const parseProps = v.parser(
	v.strictObject({
		id: v.pipe(v.string(), vx.ulid()),
		consistentRead: v.optional(v.boolean()),
	}),
	{
		abortEarly: true,
		abortPipeEarly: true,
	},
);

const parseOutput = v.parser(
	v.pipe(
		v.object({
			Item: v.optional(
				v.pipe(v.any(), v.transform(unmarshall), issueTableItemSchema),
			),
		}),
		v.transform((value) => ({
			item: value.Item,
		})),
	),
	{
		abortEarly: true,
		abortPipeEarly: true,
	},
);

export declare namespace GetIssueItemByIdFromTable {
	type Props = { id: string } & Partial<{
		consistentRead: boolean;
	}>;
}
