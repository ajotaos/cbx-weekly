import { publisherTableItemSchema } from '../types';

import {
	encodePublisherTableItemPartitionKey,
	encodePublisherTableItemSortKey,
} from '../keys';

import { throwItemNotFoundError } from '@cbx-weekly/backend-core-dynamodb';

import { GetItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

import * as vx from '@cbx-weekly/shared-valibot';
import * as v from 'valibot';

import type { PublisherTableItem } from '../types';

import type { DynamoDBClient } from '@aws-sdk/client-dynamodb';

export async function getPublisherItemByIdFromTable(
	props: GetPublisherItemByIdFromTable.Props,
	tableName: string,
	client: DynamoDBClient,
) {
	const { id, consistentRead } = parseProps(props);

	const rawPublisherItemKey = {
		Pk: encodePublisherTableItemPartitionKey({ id: id }),
		Sk: encodePublisherTableItemSortKey(),
	} satisfies Pick<PublisherTableItem.Raw, 'Pk' | 'Sk'>;

	const { item } = await client
		.send(
			new GetItemCommand({
				TableName: tableName,
				Key: marshall(rawPublisherItemKey),
				ConsistentRead: consistentRead,
			}),
		)
		.then(parseOutput);

	if (item === undefined) {
		throwItemNotFoundError('publisher', { id });
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
				v.pipe(v.any(), v.transform(unmarshall), publisherTableItemSchema),
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

export declare namespace GetPublisherItemByIdFromTable {
	type Props = { id: string } & Partial<{
		consistentRead: boolean;
	}>;
}
