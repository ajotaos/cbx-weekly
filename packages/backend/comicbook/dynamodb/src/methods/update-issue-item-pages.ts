import { issueTableItemKeys } from '../keys';

import { UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';

import { ulid } from 'ulidx';

import * as vx from '@cbx-weekly/backend-comicbook-valibot';
import * as v from 'valibot';

import type { RawIssueTableItem } from '../types';

import type { DynamoDBClient } from '@aws-sdk/client-dynamodb';

export type UpdateIssueItemPagesInTableProps = {
	id: string;
	pageIds: Array<string>;
	archiveId: string;
};

export async function updateIssueItemPagesInTable(
	props: UpdateIssueItemPagesInTableProps,
	tableName: string,
	client: DynamoDBClient,
) {
	const { id, pageIds, archiveId } = parseProps(props);

	const rawIssueItemKey = {
		Pk: issueTableItemKeys.makePk({ id }),
		Sk: issueTableItemKeys.makeSk(),
	} satisfies Pick<RawIssueTableItem, 'Pk' | 'Sk'>;

	const pages = {
		State: 'fulfilled',
		PageIds: pageIds,
		ArchiveId: archiveId,
	} satisfies Extract<RawIssueTableItem['Pages'], { State: 'fulfilled' }>;

	const updateId = ulid();

	const update = {
		Id: updateId,
		Kind: 'pages',
	} satisfies RawIssueTableItem['LatestUpdate'];

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

function parseProps(input: unknown) {
	return v.parse(propsSchema, input, {
		abortEarly: true,
		abortPipeEarly: true,
	});
}

const propsSchema = v.strictObject({
	id: v.pipe(v.string(), vx.ulid()),
	pageIds: v.array(v.pipe(v.string(), vx.ulid())),
	archiveId: v.pipe(v.string(), vx.ulid()),
});
