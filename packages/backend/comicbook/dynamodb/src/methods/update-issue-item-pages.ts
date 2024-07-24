import {
	encodeIssueTableItemPartitionKey,
	encodeIssueTableItemSortKey,
} from '../keys';

import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';

import { ulid } from 'ulidx';

import * as v from '@cbx-weekly/backend-core-valibot';

import type { Issue } from '../types';

import type { DynamoDBClient } from '@aws-sdk/client-dynamodb';

export async function updateIssueItemPagesInTable(
	props: UpdateIssueItemPagesInTable.Props,
	tableName: string,
	client: DynamoDBClient,
) {
	const documentClient = DynamoDBDocumentClient.from(client);

	const { id, archive } = parseProps(props);

	const updateId = ulid().toLowerCase();

	await documentClient.send(
		new UpdateCommand({
			TableName: tableName,
			Key: {
				Pk: encodeIssueTableItemPartitionKey({ id }),
				Sk: encodeIssueTableItemSortKey(),
			},
			ExpressionAttributeNames: {
				'#pk': 'Pk',
				'#pages': 'Pages',
				'#latestUpdate': 'LatestUpdate',
			},
			ExpressionAttributeValues: {
				':pages': {
					Archive: {
						Id: archive.id,
						PageIds: archive.pageIds,
					},
				} satisfies Issue.TableItem.Raw['Pages'],
				':update': {
					Id: updateId,
					Kind: 'pages',
				} satisfies NonNullable<Issue.TableItem.Raw['LatestUpdate']>,
			},
			UpdateExpression: 'SET #pages = :pages, #latestUpdate = :update',
			ConditionExpression: 'attribute_exists(#pk) AND #pages <> :pages',
		}),
	);
}

const parseProps = v.parser(
	v.strictObject({
		id: v.pipe(v.string(), v.id()),
		archive: v.strictObject({
			id: v.pipe(v.string(), v.id()),
			pageIds: v.array(v.pipe(v.string(), v.id())),
		}),
	}),
);

export declare namespace UpdateIssueItemPagesInTable {
	type Props = {
		id: string;
		archive: {
			id: string;
			pageIds: Array<string>;
		};
	};
}
