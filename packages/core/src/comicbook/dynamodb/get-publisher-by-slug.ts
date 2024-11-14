import { makePublisherGsi1Pk, makePublisherGsi1Sk } from './keys/publisher';
import { publisherSchema } from './types/publisher';

import { Dynamodb } from '@cbx-weekly/utils/dynamodb';

import * as v from '@cbx-weekly/valibot/core';

import type { DynamoDBClient } from '@aws-sdk/client-dynamodb';

import type { Simplify, UndefinedOnPartialDeep } from 'type-fest';

export async function getPublisherBySlug(
	props: GetPublisherBySlug.Props,
	tableName: string,
	client: DynamoDBClient,
) {
	return Dynamodb.queryItems(
		client,
		{
			tableName,
			indexName: 'Gsi1',
			keyCondition: '#gsi1pk = :gsi1pk AND #gsi1sk = :gsi1sk',
			attributes: {
				names: {
					'#gsi1pk': 'Gsi1Pk',
					'#gsi1sk': 'Gsi1Sk',
				},
				values: {
					':gsi1pk': makePublisherGsi1Pk({ slug: props.slug }),
					':gsi1sk': makePublisherGsi1Sk(),
				},
			},
			limit: 1,
			consistentRead: props.consistentRead,
		},
		publisherSchema,
		v.any(),
		v.any(),
	).then((output) => {
		if (output.items.length === 0) {
			throw Dynamodb.Errors.itemNotFound.make('publisher', {
				slug: props.slug,
			});
		}

		return { item: output.items[0] };
	});
}

export declare namespace GetPublisherBySlug {
	type Props = Simplify<
		{ slug: string } & UndefinedOnPartialDeep<
			Partial<{
				consistentRead: boolean;
			}>
		>
	>;
}
