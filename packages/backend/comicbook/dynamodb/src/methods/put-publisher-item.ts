import {
	encodePublisherTableItemGsi1PartitionKey,
	encodePublisherTableItemGsi1SortKey,
	encodePublisherTableItemGsi2PartitionKey,
	encodePublisherTableItemGsi2SortKey,
	encodePublisherTableItemPartitionKey,
	encodePublisherTableItemSortKey,
	encodePublisherUniqueSlugTableItemPartitionKey,
	encodePublisherUniqueSlugTableItemSortKey,
} from '../keys';

import { slugifyPublisherTitle } from '../slug';

import { TransactWriteItemsCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';

import { ulid } from 'ulidx';

import * as vxx from '@cbx-weekly/backend-comicbook-valibot';
import * as vx from '@cbx-weekly/shared-valibot';
import * as v from 'valibot';

import type { PublisherTableItem } from '../types';

import type {
	DynamoDBClient,
	TransactWriteItem,
} from '@aws-sdk/client-dynamodb';

export async function putPublisherItemInTable(
	props: PutPublisherItemInTable.Props,
	tableName: string,
	client: DynamoDBClient,
) {
	const { title } = parseProps(props);

	const id = ulid().toLowerCase();
	const slug = slugifyPublisherTitle(title);

	const transactItems: Array<TransactWriteItem> = [];

	const rawPublisherItem = {
		Pk: encodePublisherTableItemPartitionKey({ id }),
		Sk: encodePublisherTableItemSortKey(),
		Gsi1Pk: encodePublisherTableItemGsi1PartitionKey({ slug }),
		Gsi1Sk: encodePublisherTableItemGsi1SortKey(),
		Gsi2Pk: encodePublisherTableItemGsi2PartitionKey(),
		Gsi2Sk: encodePublisherTableItemGsi2SortKey({ slug }),
		Id: id,
		Slug: slug,
		Title: {
			Name: title.name,
		},
	} satisfies PublisherTableItem.Raw;

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

	const rawUniquePublisherSlugItem = {
		Pk: encodePublisherUniqueSlugTableItemPartitionKey({ slug }),
		Sk: encodePublisherUniqueSlugTableItemSortKey(),
		Id: id,
		Slug: slug,
	} satisfies PublisherTableItem.Unique.SlugTableItem.Raw;

	transactItems.push({
		Put: {
			TableName: tableName,
			Item: marshall(rawUniquePublisherSlugItem),
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

const parseProps = v.parser(
	v.strictObject({
		title: v.strictObject({
			name: v.pipe(v.string(), vxx.publisherName()),
		}),
	}),
	{
		abortEarly: true,
		abortPipeEarly: true,
	},
);

export declare namespace PutPublisherItemInTable {
	type Props = {
		title: {
			name: string;
		};
	};
}
