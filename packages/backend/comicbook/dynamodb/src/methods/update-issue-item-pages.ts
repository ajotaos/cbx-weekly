import {
	encodeIssueTableItemPartitionKey,
	encodeIssueTableItemSortKey,
} from '../keys';

import { UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';

import { ulid } from 'ulidx';

import * as vx from '@cbx-weekly/shared-valibot';
import * as v from 'valibot';

import type { IssueTableItem } from '../types';

import type { DynamoDBClient } from '@aws-sdk/client-dynamodb';

export async function updateIssueItemPagesInTable(
	props: UpdateIssueItemPagesInTable.Props,
	tableName: string,
	client: DynamoDBClient,
) {
	const { id, pageIds, archiveId } = parseProps(props);

	const rawIssueItemKey = {
		Pk: encodeIssueTableItemPartitionKey({ id }),
		Sk: encodeIssueTableItemSortKey(),
	} satisfies Pick<IssueTableItem.Raw, 'Pk' | 'Sk'>;

	const pages = {
		State: 'fulfilled',
		PageIds: pageIds,
		ArchiveId: archiveId,
	} satisfies Extract<IssueTableItem.Raw['Pages'], { State: 'fulfilled' }>;

	const updateId = ulid().toLowerCase();

	const update = {
		Id: updateId,
		Kind: 'pages',
	} satisfies IssueTableItem.Raw['LatestUpdate'];

	await client.send(
		new UpdateItemCommand({
			TableName: tableName,
			Key: marshall(rawIssueItemKey),
			ExpressionAttributeNames: {
				'#Pk': 'Pk',
				'#Pages': 'Pages',
				'#LatestUpdate': 'LatestUpdate',
			},
			ExpressionAttributeValues: marshall({
				':pages': pages,
				':update': update,
			}),
			UpdateExpression: 'SET #Pages = :pages, #LatestUpdate = :update',
			ConditionExpression: 'attribute_exists(#Pk) AND #Pages <> :pages',
		}),
	);
}

const parseProps = v.parser(
	v.strictObject({
		id: v.pipe(v.string(), vx.ulid()),
		pageIds: v.array(v.pipe(v.string(), vx.ulid())),
		archiveId: v.pipe(v.string(), vx.ulid()),
	}),
	{
		abortEarly: true,
		abortPipeEarly: true,
	},
);

export declare namespace UpdateIssueItemPagesInTable {
	type Props = {
		id: string;
		pageIds: Array<string>;
		archiveId: string;
	};
}
