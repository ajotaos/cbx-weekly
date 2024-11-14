import { makeIssuePk, makeIssueSk } from './keys/issue';
import {
	makePagesetGsi1Pk,
	makePagesetGsi1Sk,
	makePagesetPk,
	makePagesetSk,
} from './keys/pageset';

import { Dynamodb } from '@cbx-weekly/utils/dynamodb';

import { addSeconds, getUnixTime } from 'date-fns';

import { decodeTime, ulid } from 'ulidx';

import * as v from '@cbx-weekly/valibot/core';

import type { DynamoDBClient } from '@aws-sdk/client-dynamodb';

export async function putPageset(
	props: PutPageset.Props,
	tableName: string,
	client: DynamoDBClient,
) {
	const issueId = parseIssueId(props.issueId);

	const transaction = Dynamodb.createTransactionWriteBuilder(client);

	transaction.conditionCheck(
		{
			tableName,
			key: {
				Pk: makeIssuePk({ id: issueId }),
				Sk: makeIssueSk(),
			},
			condition: 'attribute_exists(#pk)',
			attributes: {
				names: {
					'#pk': 'Pk',
				},
			},
		},
		() => {
			throw Dynamodb.Errors.itemNotFound.make('issue', { id: issueId });
		},
	);

	const id = makePagesetId();

	transaction.put(
		{
			tableName,
			item: {
				Pk: makePagesetPk({ id }),
				Sk: makePagesetSk(),
				Gsi1Pk: makePagesetGsi1Pk({ issueId }),
				Gsi1Sk: makePagesetGsi1Sk({ created: String(decodeTime(id)) }),
				Id: id,
				Status: 'created',
				IssueId: issueId,
				Expiration: getUnixTime(addSeconds(decodeTime(id), 10)),
			},
			condition: 'attribute_not_exists(#pk)',
			attributes: {
				names: {
					'#pk': 'Pk',
				},
			},
		},
		() => {
			throw Dynamodb.Errors.itemAlreadyExists.make('pageset', { id });
		},
	);

	await transaction.execute();

	return { item: { id } };
}

function makePagesetId() {
	return ulid().toLowerCase();
}

const parseIssueId = v.parser(v.pipe(v.string(), v.id()));

export declare namespace PutPageset {
	type Props = {
		issueId: string;
	};
}
