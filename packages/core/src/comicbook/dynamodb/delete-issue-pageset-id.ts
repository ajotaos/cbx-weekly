import { makeIssuePk, makeIssueSk } from './keys/issue';
import {
	makeIssueUniquePagesetIdPk,
	makeIssueUniquePagesetIdSk,
} from './keys/issue-unq-pageset-id';

import { Dynamodb } from '@cbx-weekly/utils/dynamodb';

import * as v from '@cbx-weekly/valibot/core';

import type { DynamoDBClient } from '@aws-sdk/client-dynamodb';

export async function deleteIssuePagesetId(
	props: DeleteIssueUniquePagesetId.Props,
	tableName: string,
	client: DynamoDBClient,
) {
	const transaction = Dynamodb.createTransactionWriteBuilder(client);

	const issueId = parseIssueId(props.issueId);

	const pagesetId = parsePagesetId(props.pagesetId);

	transaction.conditionCheck({
		tableName,
		key: {
			Pk: makeIssuePk({
				id: issueId,
			}),
			Sk: makeIssueSk(),
		},
		condition: 'attribute_exists(#pk) AND #pagesetId <> :pagesetId',
		attributes: {
			names: {
				'#pk': 'Pk',
				'#pagesetId': 'PagesetId',
			},
			values: {
				':pagesetId': pagesetId,
			},
		},
	});

	transaction.delete({
		tableName,
		key: {
			Pk: makeIssueUniquePagesetIdPk({
				pagesetId,
			}),
			Sk: makeIssueUniquePagesetIdSk(),
		},
	});

	await transaction.execute();
}

const parsePagesetId = v.parser(v.pipe(v.string(), v.id()));
const parseIssueId = v.parser(v.pipe(v.string(), v.id()));

export declare namespace DeleteIssueUniquePagesetId {
	type Props = {
		pagesetId: string;
		issueId: string;
	};
}
