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

import {
	DynamoDBDocumentClient,
	TransactWriteCommand,
} from '@aws-sdk/lib-dynamodb';

import { ulid } from 'ulidx';

import * as v from '@cbx-weekly/backend-core-valibot';
import * as vx from '../valibot';

import type { Publisher, Series } from '../types';

import type { TransactWriteCommandInput } from '@aws-sdk/lib-dynamodb';

import type { DynamoDBClient } from '@aws-sdk/client-dynamodb';

export async function putSeriesItemInTable(
	props: PutSeriesItemInTable.Props,
	tableName: string,
	client: DynamoDBClient,
) {
	const documentClient = DynamoDBDocumentClient.from(client);

	const { title, publisherId, releaseDate } = parseProps(props);

	const transactItems: NonNullable<TransactWriteCommandInput['TransactItems']> =
		[];

	transactItems.push({
		ConditionCheck: {
			TableName: tableName,
			Key: {
				Pk: encodePublisherTableItemPartitionKey({ id: publisherId }),
				Sk: encodePublisherTableItemSortKey(),
			} satisfies Pick<Publisher.TableItem.Raw, 'Pk' | 'Sk'>,
			ExpressionAttributeNames: {
				'#pk': 'Pk',
				'#title': 'Title',
				'#name': 'Name',
			},
			ExpressionAttributeValues: {
				':titlePublisher': title.publisher,
			},
			ConditionExpression:
				'attribute_exists(#pk) AND #title.#name = :titlePublisher',
		},
	});

	const id = ulid().toLowerCase();
	const slug = slugifySeriesTitle(title);

	transactItems.push({
		Put: {
			TableName: tableName,
			Item: {
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
			} satisfies Series.TableItem.Raw,
			ExpressionAttributeNames: {
				'#pk': 'Pk',
			},
			ConditionExpression: 'attribute_not_exists(#pk)',
		},
	});

	transactItems.push({
		Put: {
			TableName: tableName,
			Item: {
				Pk: encodeSeriesUniqueSlugTableItemPartitionKey({ slug }),
				Sk: encodeSeriesUniqueSlugTableItemSortKey(),
				Id: id,
				Slug: slug,
			} satisfies Series.Unique.Slug.TableItem.Raw,
			ExpressionAttributeNames: {
				'#pk': 'Pk',
			},
			ConditionExpression: 'attribute_not_exists(#pk)',
		},
	});

	await documentClient.send(
		new TransactWriteCommand({
			TransactItems: transactItems,
		}),
	);

	return { item: { id } };
}

const parseProps = v.parser(
	v.strictObject({
		title: v.strictObject({
			publisher: v.pipe(v.string(), vx.publisherName()),
			name: v.pipe(v.string(), vx.seriesName()),
		}),
		releaseDate: v.pipe(v.string(), v.isoDate()),
		publisherId: v.pipe(v.string(), v.ulid()),
	}),
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
