import {
	makePublisherGsi2Cursor,
	makePublisherGsi2Pk,
	makePublisherGsi2Sk,
	makePublisherPk,
	makePublisherSk,
} from './keys/publisher';
import {
	publisherGsi2CursorSchema,
	publisherGsi2KeysSchema,
	publisherSchema,
} from './types/publisher';

import { Dynamodb } from '@cbx-weekly/utils/dynamodb';

import * as v from '@cbx-weekly/valibot/core';

import type { DynamoDBClient } from '@aws-sdk/client-dynamodb';

import type { UndefinedOnPartialDeep } from 'type-fest';

export async function queryPublishers(
	props: QueryPublishers.Props,
	tableName: string,
	client: DynamoDBClient,
) {
	return Dynamodb.queryItems(
		client,
		{
			tableName,
			indexName: 'Gsi2',
			keyCondition: '#gsi2pk = :gsi2pk AND begins_with(#gsi2sk, :gsi2sk)',
			attributes: {
				names: {
					'#gsi2pk': 'Gsi2Pk',
					'#gsi2sk': 'Gsi2Sk',
				},
				values: {
					':gsi2pk': makePublisherGsi2Pk(),
					':gsi2sk': makePublisherGsi2Sk({ slug: '' }),
				},
			},
			cursor: props.cursor,
			order: props.order,
			limit: props.limit,
			consistentRead: props.consistentRead,
		},
		publisherSchema,
		v.pipe(
			publisherGsi2CursorSchema,
			v.transform((props) => ({
				Pk: makePublisherPk({ id: props.id }),
				Sk: makePublisherSk(),
				Gsi2Pk: makePublisherGsi2Pk(),
				Gsi2Sk: makePublisherGsi2Sk({ slug: props.slug }),
			})),
		),
		v.pipe(publisherGsi2KeysSchema, v.transform(makePublisherGsi2Cursor)),
	);
}

export declare namespace QueryPublishers {
	type Props = UndefinedOnPartialDeep<
		Partial<{
			cursor: string;
			order: 'asc' | 'desc';
			limit: number;
			consistentRead: boolean;
		}>
	>;
}
