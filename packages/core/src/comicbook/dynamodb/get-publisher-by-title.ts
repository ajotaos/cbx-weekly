import { makePublisherGsi1Pk, makePublisherGsi1Sk } from './keys/publisher';
import { publisherSchema } from './types/publisher';

import { makePublisherSlug } from './slugs/publisher';

import { Dynamodb } from '@cbx-weekly/utils/dynamodb';

import * as v from '@cbx-weekly/valibot/core';

import type { DynamoDBClient } from '@aws-sdk/client-dynamodb';

import type { Simplify, UndefinedOnPartialDeep } from 'type-fest';

import type * as v_comicbook from '@cbx-weekly/valibot/comicbook';

export async function getPublisherByTitle(
	props: GetPublisherByTitle.Props,
	tableName: string,
	client: DynamoDBClient,
) {
	const slug = makePublisherSlug(props.title);

	return Dynamodb.queryItems(
		client,
		{
			tableName,
			indexName: 'Gsi1',
			keyCondition: '#gsi1pk = :gsi1pk AND #gsi1sk = :gsi1sk',
			filter: '#title.#name = :titleName',
			attributes: {
				names: {
					'#gsi1pk': 'Gsi1Pk',
					'#gsi1sk': 'Gsi1Sk',
					'#title': 'Title',
					'#name': 'Name',
				},
				values: {
					':gsi1pk': makePublisherGsi1Pk({ slug }),
					':gsi1sk': makePublisherGsi1Sk(),
					':titleName': props.title.name,
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
				title: {
					name: props.title.name,
				},
			});
		}

		return { item: output.items[0] };
	});
}

export declare namespace GetPublisherByTitle {
	type Props = Simplify<
		{ title: v_comicbook.PublisherTitleComponents } & UndefinedOnPartialDeep<
			Partial<{
				consistentRead: boolean;
			}>
		>
	>;
}
