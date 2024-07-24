import {
	publisherTableItemKeys,
	publisherUniqueSlugTableItemKeys,
} from '../keys';

import { makePublisherSlug } from '../slug';

import { TransactWriteItemsCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';

import { ulid } from 'ulidx';

import * as vx from '@cbx-weekly/backend-comicbook-valibot';
import * as v from 'valibot';

import type {
	RawPublisherTableItem,
	RawPublisherUniqueSlugTableItem,
} from '../types';

import type {
	DynamoDBClient,
	TransactWriteItem,
} from '@aws-sdk/client-dynamodb';

export type PutPublisherItemInTableProps = {
	title: {
		name: string;
	};
};

export async function putPublisherItemInTable(
	props: PutPublisherItemInTableProps,
	tableName: string,
	client: DynamoDBClient,
) {
	const { title } = parseProps(props);

	const id = ulid();
	const slug = makePublisherSlug(title);

	const transactItems: Array<TransactWriteItem> = [];

	const rawPublisherItem = {
		Pk: publisherTableItemKeys.makePk({ id }),
		Sk: publisherTableItemKeys.makeSk(),
		Gsi1Pk: publisherTableItemKeys.makeGsi1Pk({ slug }),
		Gsi1Sk: publisherTableItemKeys.makeGsi1Sk(),
		Gsi2Pk: publisherTableItemKeys.makeGsi2Pk(),
		Gsi2Sk: publisherTableItemKeys.makeGsi2Sk({ slug }),
		Id: id,
		Slug: slug,
		Title: {
			Name: title.name,
		},
	} satisfies RawPublisherTableItem;

	transactItems.push({
		Put: {
			TableName: tableName,
			Item: marshall(rawPublisherItem),
			ExpressionAttributeNames: {
				'#Pk': 'Pk',
			},
			ConditionExpression: 'attribute_not_exists(#Pk)',
		},
	});

	const rawPublisherUniqueSlugItem = {
		Pk: publisherUniqueSlugTableItemKeys.makePk({ slug }),
		Sk: publisherUniqueSlugTableItemKeys.makeSk(),
		Id: id,
		Slug: slug,
	} satisfies RawPublisherUniqueSlugTableItem;

	transactItems.push({
		Put: {
			TableName: tableName,
			Item: marshall(rawPublisherUniqueSlugItem),
			ExpressionAttributeNames: {
				'#Pk': 'Pk',
			},
			ConditionExpression: 'attribute_not_exists(#Pk)',
		},
	});

	await client.send(
		new TransactWriteItemsCommand({
			TransactItems: transactItems,
		}),
	);

	return { item: { id } };
}

function parseProps(input: unknown) {
	return v.parse(propsSchema, input, {
		abortEarly: true,
		abortPipeEarly: true,
	});
}

const propsSchema = v.strictObject({
	title: v.strictObject({
		name: v.pipe(v.string(), vx.publisherName()),
	}),
});
