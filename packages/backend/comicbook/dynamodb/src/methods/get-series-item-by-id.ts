import { seriesTableItemSchema } from '../types';

import {
	encodeSeriesTableItemPartitionKey,
	encodeSeriesTableItemSortKey,
} from '../keys';

import { throwItemNotFoundError } from '@cbx-weekly/backend-core-dynamodb';

import { GetItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

import * as vx from '@cbx-weekly/shared-valibot';
import * as v from 'valibot';

import type { SeriesTableItem } from '../types';

import type { DynamoDBClient } from '@aws-sdk/client-dynamodb';

export async function getSeriesItemByIdFromTable(
	props: GetSeriesItemByIdFromTable.Props,
	tableName: string,
	client: DynamoDBClient,
) {
	const { id, consistentRead } = parseProps(props);

	const rawSeriesItemKey = {
		Pk: encodeSeriesTableItemPartitionKey({ id }),
		Sk: encodeSeriesTableItemSortKey(),
	} satisfies Pick<SeriesTableItem.Raw, 'Pk' | 'Sk'>;

	const { item } = await client
		.send(
			new GetItemCommand({
				TableName: tableName,
				Key: marshall(rawSeriesItemKey),
				ConsistentRead: consistentRead,
			}),
		)
		.then(parseOutput);

	if (item === undefined) {
		throwItemNotFoundError('series', { id });
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
				v.pipe(v.any(), v.transform(unmarshall), seriesTableItemSchema),
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

export declare namespace GetSeriesItemByIdFromTable {
	type Props = { id: string } & Partial<{
		consistentRead: boolean;
	}>;
}
