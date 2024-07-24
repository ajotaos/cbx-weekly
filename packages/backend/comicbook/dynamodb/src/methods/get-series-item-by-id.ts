import { seriesTableItemSchema } from '../types';

import {
	encodeSeriesTableItemPartitionKey,
	encodeSeriesTableItemSortKey,
} from '../keys';

import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';

import * as v from '@cbx-weekly/backend-core-valibot';

import { throwItemNotFoundError } from '@cbx-weekly/backend-core-dynamodb';

import type { Series } from '../types';

import type { DynamoDBClient } from '@aws-sdk/client-dynamodb';

import type { Simplify } from 'type-fest';

export async function getSeriesItemByIdFromTable(
	props: GetSeriesItemByIdFromTable.Props,
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
					Pk: encodeSeriesTableItemPartitionKey({ id }),
					Sk: encodeSeriesTableItemSortKey(),
				} satisfies Pick<Series.TableItem.Raw, 'Pk' | 'Sk'>,
				ConsistentRead: consistentRead,
			}),
		)
		.then(({ Item }) => {
			const item = parseItem(Item);

			if (item === undefined) {
				throwItemNotFoundError('series', { id });
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

const parseItem = v.parser(v.optional(seriesTableItemSchema));

export declare namespace GetSeriesItemByIdFromTable {
	type Props = Simplify<
		{ id: string } & Partial<{
			consistentRead: boolean;
		}>
	>;
}
