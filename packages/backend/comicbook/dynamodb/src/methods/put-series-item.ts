import {
	publisherTableItemKeys,
	seriesTableItemKeys,
	seriesUniqueSlugTableItemKeys,
} from '../keys';

import { makeSeriesSlug } from '../slug';

import { TransactWriteItemsCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';

import { ulid } from 'ulidx';

import * as vx from '@cbx-weekly/backend-comicbook-valibot';
import * as v from 'valibot';

import type {
	RawPublisherTableItem,
	RawSeriesTableItem,
	RawSeriesUniqueSlugTableItem,
} from '../types';

import type {
	DynamoDBClient,
	TransactWriteItem,
} from '@aws-sdk/client-dynamodb';

export type PutSeriesItemInTableProps = {
	title: {
		publisher: string;
		name: string;
	};
	publisherId: string;
	releaseDate: string;
};

export async function putSeriesItemInTable(
	props: PutSeriesItemInTableProps,
	tableName: string,
	client: DynamoDBClient,
) {
	const { title, publisherId, releaseDate } = parseProps(props);

	const transactItems: Array<TransactWriteItem> = [];

	const rawPublisherItemKey = {
		Pk: publisherTableItemKeys.makePk({ id: publisherId }),
		Sk: publisherTableItemKeys.makeSk(),
	} satisfies Pick<RawPublisherTableItem, 'Pk' | 'Sk'>;

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

	const id = ulid();
	const slug = makeSeriesSlug(title);

	const rawSeriesItem = {
		Pk: seriesTableItemKeys.makePk({ id }),
		Sk: seriesTableItemKeys.makeSk(),
		Gsi1Pk: seriesTableItemKeys.makeGsi1Pk({ slug }),
		Gsi1Sk: seriesTableItemKeys.makeGsi1Sk(),
		Gsi2Pk: seriesTableItemKeys.makeGsi2Pk({ publisherId }),
		Gsi2Sk: seriesTableItemKeys.makeGsi2Sk({ slug }),
		Gsi3Pk: seriesTableItemKeys.makeGsi3Pk({ releaseDate }),
		Gsi3Sk: seriesTableItemKeys.makeGsi3Sk({ slug }),
		Id: id,
		Slug: slug,
		Title: {
			Publisher: title.publisher,
			Name: title.name,
		},
		PublisherId: publisherId,
		ReleaseDate: releaseDate,
	} satisfies RawSeriesTableItem;

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

	const rawSeriesUniqueSlugItem = {
		Pk: seriesUniqueSlugTableItemKeys.makePk({ slug }),
		Sk: seriesUniqueSlugTableItemKeys.makeSk(),
		Id: id,
		Slug: slug,
	} satisfies RawSeriesUniqueSlugTableItem;

	transactItems.push({
		Put: {
			TableName: tableName,
			Item: marshall(rawSeriesUniqueSlugItem),
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
		publisher: v.pipe(v.string(), vx.publisherName()),
		name: v.pipe(v.string(), vx.seriesName()),
	}),
	publisherId: v.pipe(v.string(), vx.ulid()),
	releaseDate: v.pipe(v.string(), v.isoDate()),
});
