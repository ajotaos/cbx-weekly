import {
	makeIssueUniquePagesetIdPk,
	makeIssueUniquePagesetIdSk,
} from './keys/issue-unq-pageset-id';
import { makePagesetPk, makePagesetSk } from './keys/pageset';

import { Dynamodb } from '@cbx-weekly/utils/dynamodb';

import * as v from '@cbx-weekly/valibot/core';

import type { DynamoDBClient } from '@aws-sdk/client-dynamodb';

export async function deletePageset(
	props: DeletePageset.Props,
	tableName: string,
	client: DynamoDBClient,
) {
	const transaction = Dynamodb.createTransactionWriteBuilder(client);

	const id = parsePagesetId(props.id);

	transaction.conditionCheck(
		{
			tableName,
			key: {
				Pk: makeIssueUniquePagesetIdPk({ pagesetId: id }),
				Sk: makeIssueUniquePagesetIdSk(),
			},
			condition: 'attribute_not_exists(#pk)',
			attributes: {
				names: {
					'#pk': 'Pk',
				},
			},
		},
		() => {
			throw Dynamodb.Errors.itemAlreadyExists.make('issue', {
				pagesetId: id,
			});
		},
	);

	transaction.delete({
		tableName,
		key: {
			Pk: makePagesetPk({ id }),
			Sk: makePagesetSk(),
		},
	});

	await transaction.execute();
}

const parsePagesetId = v.parser(v.pipe(v.string(), v.id()));

export declare namespace DeletePageset {
	type Props = {
		id: string;
	};
}
