import {
	encodePublisherTableItemPartitionKey,
	encodePublisherTableItemSortKey,
	encodeSeriesTableItemGsi1PartitionKey,
	encodeSeriesTableItemGsi1SortKey,
	encodeSeriesTableItemGsi2PartitionKey,
	encodeSeriesTableItemGsi2SortKey,
	encodeSeriesTableItemGsi3PartitionKey,
	encodeSeriesTableItemGsi3SortKey,
	encodeSeriesTableItemPartitionKey,
	encodeSeriesTableItemSortKey,
	encodeSeriesUniqueSlugTableItemPartitionKey,
	encodeSeriesUniqueSlugTableItemSortKey,
} from '../keys';

import { slugifySeriesTitle } from '../slug';

import { TransactWriteItemsCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';

import { ulid } from 'ulidx';

import * as vxx from '@cbx-weekly/backend-comicbook-valibot';
import * as vx from '@cbx-weekly/shared-valibot';
import * as v from 'valibot';

import type { PublisherTableItem, SeriesTableItem } from '../types';

import type {
	DynamoDBClient,
	TransactWriteItem,
} from '@aws-sdk/client-dynamodb';

export async function putSeriesItemInTable(
	props: PutSeriesItemInTable.Props,
	tableName: string,
	client: DynamoDBClient,
) {
	const { title, publisherId, releaseDate } = parseProps(props);

	const transactItems: Array<TransactWriteItem> = [];

	const rawPublisherItemKey = {
		Pk: encodePublisherTableItemPartitionKey({ id: publisherId }),
		Sk: encodePublisherTableItemSortKey(),
	} satisfies Pick<PublisherTableItem.Raw, 'Pk' | 'Sk'>;

	transactItems.push({
		ConditionCheck: {
			TableName: tableName,
			Key: marshall(rawPublisherItemKey),
			ExpressionAttributeNames: {
				'#Pk': 'Pk',
				'#Title': 'Title',
				'#Name': 'Name',
			},
			ExpressionAttributeValues: marshall({
				':titleName': title.publisher,
			}),
			ConditionExpression:
				'attribute_exists(#Pk) AND #Title.#Name = :titleName',
		},
	});

	const id = ulid().toLowerCase();
	const slug = slugifySeriesTitle(title);

	const rawSeriesItem = {
		Pk: encodeSeriesTableItemPartitionKey({ id }),
		Sk: encodeSeriesTableItemSortKey(),
		Gsi1Pk: encodeSeriesTableItemGsi1PartitionKey({ slug }),
		Gsi1Sk: encodeSeriesTableItemGsi1SortKey(),
		Gsi2Pk: encodeSeriesTableItemGsi2PartitionKey({ publisherId }),
		Gsi2Sk: encodeSeriesTableItemGsi2SortKey({ slug }),
		Gsi3Pk: encodeSeriesTableItemGsi3PartitionKey({ releaseDate }),
		Gsi3Sk: encodeSeriesTableItemGsi3SortKey({ slug }),
		Id: id,
		Slug: slug,
		Title: {
			Publisher: title.publisher,
			Name: title.name,
		},
		ReleaseDate: releaseDate,
		PublisherId: publisherId,
	} satisfies SeriesTableItem.Raw;

	transactItems.push({
		Put: {
			TableName: tableName,
			Item: marshall(rawSeriesItem),
			ExpressionAttributeNames: {
				'#Pk': 'Pk',
			},
			ConditionExpression: 'attribute_not_exists(#Pk)',
		},
	});

	const rawUniqueSeriesSlugItem = {
		Pk: encodeSeriesUniqueSlugTableItemPartitionKey({ slug }),
		Sk: encodeSeriesUniqueSlugTableItemSortKey(),
		Id: id,
		Slug: slug,
	} satisfies SeriesTableItem.Unique.SlugTableItem.Raw;

	transactItems.push({
		Put: {
			TableName: tableName,
			Item: marshall(rawUniqueSeriesSlugItem),
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
			publisher: v.pipe(v.string(), vxx.publisherName()),
			name: v.pipe(v.string(), vxx.seriesName()),
		}),
		releaseDate: v.pipe(v.string(), v.isoDate()),
		publisherId: v.pipe(v.string(), vx.ulid()),
	}),
	{
		abortEarly: true,
		abortPipeEarly: true,
	},
);

export declare namespace PutSeriesItemInTable {
	type Props = {
		title: {
			publisher: string;
			name: string;
		};
		releaseDate: string;
		publisherId: string;
	};
}
