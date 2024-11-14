import {
	makePublisherGsi1Pk,
	makePublisherGsi1Sk,
	makePublisherGsi2Pk,
	makePublisherGsi2Sk,
	makePublisherPk,
	makePublisherSk,
} from './keys/publisher';
import {
	makePublisherUniqueSlugPk,
	makePublisherUniqueSlugSk,
} from './keys/publisher-unq-slug';

import { makePublisherSlug } from './slugs/publisher';

import { Dynamodb } from '@cbx-weekly/utils/dynamodb';

import * as v_comicbook from '@cbx-weekly/valibot/comicbook';
import * as v from '@cbx-weekly/valibot/core';

import { ulid } from 'ulidx';

import type { DynamoDBClient } from '@aws-sdk/client-dynamodb';

export async function putPublisher(
	props: PutPublisher.Props,
	tableName: string,
	client: DynamoDBClient,
) {
	const transaction = Dynamodb.createTransactionWriteBuilder(client);

	const title = parsePublisherTitle(props.title);

	const id = makePublisherId();
	const slug = makePublisherSlug(title);

	transaction.put(
		{
			tableName,
			item: {
				Pk: makePublisherPk({ id }),
				Sk: makePublisherSk(),
				Gsi1Pk: makePublisherGsi1Pk({ slug }),
				Gsi1Sk: makePublisherGsi1Sk(),
				Gsi2Pk: makePublisherGsi2Pk(),
				Gsi2Sk: makePublisherGsi2Sk({ slug }),
				Id: id,
				Slug: slug,
				Title: {
					Name: title.name,
				},
			},
			condition: 'attribute_not_exists(#pk)',
			attributes: {
				names: {
					'#pk': 'Pk',
				},
			},
		},
		() => {
			throw Dynamodb.Errors.itemAlreadyExists.make('publisher', { id });
		},
	);

	transaction.put(
		{
			tableName,
			item: {
				Pk: makePublisherUniqueSlugPk({ slug }),
				Sk: makePublisherUniqueSlugSk(),
				Slug: slug,
				PublisherId: id,
			},
			condition: 'attribute_not_exists(#pk)',
			attributes: {
				names: {
					'#pk': 'Pk',
				},
			},
		},
		() => {
			throw Dynamodb.Errors.itemAlreadyExists.make('publisher', { slug });
		},
	);

	await transaction.execute();

	return { item: { id } };
}

function makePublisherId() {
	return ulid().toLowerCase();
}

const parsePublisherTitle = v.parser(
	v_comicbook.publisherTitleComponentsSchema,
);

export declare namespace PutPublisher {
	type Props = {
		title: v_comicbook.PublisherTitleComponents;
	};
}
