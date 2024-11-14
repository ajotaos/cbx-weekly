import { makeIssuePk, makeIssueSk } from './keys/issue';
import {
	makeIssueUniquePagesetIdPk,
	makeIssueUniquePagesetIdSk,
} from './keys/issue-unq-pageset-id';
import { makePagesetPk, makePagesetSk } from './keys/pageset';

import { Dynamodb } from '@cbx-weekly/utils/dynamodb';

import { ulid } from 'ulidx';

import * as v from '@cbx-weekly/valibot/core';

import type { DynamoDBClient } from '@aws-sdk/client-dynamodb';

export async function updateIssuePagesetId(
	props: UpdateIssuePagesetId.Props,
	tableName: string,
	client: DynamoDBClient,
) {
	const id = parseIssueId(props.id);

	const updateId = makeUpdateId();

	if (props.pagesetId === null) {
		await Dynamodb.updateItem(
			client,
			{
				tableName,
				key: {
					Pk: makeIssuePk({ id }),
					Sk: makeIssueSk(),
				},
				update: 'SET #latestUpdate = :update REMOVE #pagesetId',
				condition: 'attribute_exists(#pk)',
				attributes: {
					names: {
						'#pk': 'Pk',
						'#pagesetId': 'PagesetId',
						'#latestUpdate': 'LatestUpdate',
					},
					values: {
						':update': {
							Id: updateId,
							Type: 'pageset-id',
						},
					},
				},
			},
			() => {
				throw Dynamodb.Errors.itemNotFound.make('issue', { id });
			},
		);
	} else {
		const transaction = Dynamodb.createTransactionWriteBuilder(client);

		const pagesetId = parsePagesetId(props.pagesetId);

		transaction.conditionCheck(
			{
				tableName,
				key: {
					Pk: makePagesetPk({ id: pagesetId }),
					Sk: makePagesetSk(),
				},
				condition:
					'attribute_exists(#pk) AND #issueId = :issueId AND #status = :ready',
				attributes: {
					names: {
						'#pk': 'Pk',
						'#issueId': 'IssueId',
						'#status': 'Status',
					},
					values: {
						':issueId': id,
						':ready': 'ready',
					},
				},
			},
			() => {
				throw Dynamodb.Errors.itemNotFound.make('pageset', {
					id: pagesetId,
					status: 'ready',
					issueId: id,
				});
			},
		);

		transaction.update(
			{
				tableName,
				key: {
					Pk: makeIssuePk({ id }),
					Sk: makeIssueSk(),
				},
				update: 'SET #pagesetId = :pagesetId, #latestUpdate = :update',
				condition: 'attribute_exists(#pk)',
				attributes: {
					names: {
						'#pk': 'Pk',
						'#pagesetId': 'PagesetId',
						'#latestUpdate': 'LatestUpdate',
					},
					values: {
						':pagesetId': pagesetId,
						':update': {
							Id: updateId,
							Type: 'pageset-id',
						},
					},
				},
			},
			() => {
				throw Dynamodb.Errors.itemNotFound.make('issue', { id });
			},
		);

		transaction.put(
			{
				tableName,
				item: {
					Pk: makeIssueUniquePagesetIdPk({
						pagesetId,
					}),
					Sk: makeIssueUniquePagesetIdSk(),
					PagesetId: pagesetId,
					IssueId: id,
				},
				condition: 'attribute_not_exists(#pk) OR #pagesetId = :pagesetId',
				attributes: {
					names: {
						'#pk': 'Pk',
						'#pagesetId': 'PagesetId',
					},
					values: {
						':pagesetId': pagesetId,
					},
				},
			},
			() => {
				throw Dynamodb.Errors.itemAlreadyExists.make('issue', {
					pagesetId,
				});
			},
		);

		await transaction.execute();
	}
}

function makeUpdateId() {
	return ulid().toLowerCase();
}

const parsePagesetId = v.parser(v.pipe(v.string(), v.id()));
const parseIssueId = v.parser(v.pipe(v.string(), v.id()));

export declare namespace UpdateIssuePagesetId {
	type Props = {
		id: string;
		pagesetId: string | null;
	};
}
