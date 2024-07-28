import {
	encodeIssueTableItemGsi1PartitionKey,
	encodeIssueTableItemGsi1SortKey,
	encodeIssueTableItemGsi2PartitionKey,
	encodeIssueTableItemGsi2SortKey,
	encodeIssueTableItemGsi3PartitionKey,
	encodeIssueTableItemGsi3SortKey,
	encodeIssueTableItemPartitionKey,
	encodeIssueTableItemSortKey,
	encodeIssueUniqueSlugTableItemPartitionKey,
	encodeIssueUniqueSlugTableItemSortKey,
	encodeSeriesTableItemPartitionKey,
	encodeSeriesTableItemSortKey,
} from '../keys';

import { slugifyIssueTitle } from '../slug';

import { TransactWriteItemsCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';

import { ulid } from 'ulidx';

import * as vxx from '@cbx-weekly/backend-comicbook-valibot';
import * as vx from '@cbx-weekly/shared-valibot';
import * as v from 'valibot';

import type { IssueTableItem, SeriesTableItem } from '../types';

import type {
	DynamoDBClient,
	TransactWriteItem,
} from '@aws-sdk/client-dynamodb';

export async function putIssueItemInTable(
	props: PutIssueItemInTable.Props,
	tableName: string,
	client: DynamoDBClient,
) {
	const { title, seriesId, releaseDate } = parseProps(props);

	const transactItems: Array<TransactWriteItem> = [];

	const rawSeriesItemKey = {
		Pk: encodeSeriesTableItemPartitionKey({ id: seriesId }),
		Sk: encodeSeriesTableItemSortKey(),
	} satisfies Pick<SeriesTableItem.Raw, 'Pk' | 'Sk'>;

	transactItems.push({
		ConditionCheck: {
			TableName: tableName,
			Key: marshall(rawSeriesItemKey),
			ExpressionAttributeNames: {
				'#Pk': 'Pk',
				'#Title': 'Title',
				'#Publisher': 'Publisher',
				'#Name': 'Name',
			},
			ExpressionAttributeValues: marshall({
				':titlePublisher': title.publisher,
				':titleName': title.series,
			}),
			ConditionExpression:
				'attribute_exists(#Pk) AND #Title.#Publisher = :titlePublisher AND #Title.#Name = :titleName',
		},
	});

	const id = ulid().toLowerCase();
	const slug = slugifyIssueTitle(title);

	const rawIssueItem = {
		Pk: encodeIssueTableItemPartitionKey({ id }),
		Sk: encodeIssueTableItemSortKey(),
		Gsi1Pk: encodeIssueTableItemGsi1PartitionKey({ slug }),
		Gsi1Sk: encodeIssueTableItemGsi1SortKey(),
		Gsi2Pk: encodeIssueTableItemGsi2PartitionKey({ seriesId }),
		Gsi2Sk: encodeIssueTableItemGsi2SortKey({ slug }),
		Gsi3Pk: encodeIssueTableItemGsi3PartitionKey({ releaseDate }),
		Gsi3Sk: encodeIssueTableItemGsi3SortKey({ slug }),
		Id: id,
		Slug: slug,
		Title: {
			Publisher: title.publisher,
			Series: title.series,
			Number: title.number,
		},
		ReleaseDate: releaseDate,
		Pages: {
			State: 'pending',
		},
		SeriesId: seriesId,
	} satisfies IssueTableItem.Raw;

	transactItems.push({
		Put: {
			TableName: tableName,
			Item: marshall(rawIssueItem),
			ExpressionAttributeNames: {
				'#Pk': 'Pk',
			},
			ConditionExpression: 'attribute_not_exists(#Pk)',
		},
	});

	const rawUniqueIssueSlugItem = {
		Pk: encodeIssueUniqueSlugTableItemPartitionKey({ slug }),
		Sk: encodeIssueUniqueSlugTableItemSortKey(),
		Id: id,
		Slug: slug,
	} satisfies IssueTableItem.Unique.SlugTableItem.Raw;

	transactItems.push({
		Put: {
			TableName: tableName,
			Item: marshall(rawUniqueIssueSlugItem),
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
			series: v.pipe(v.string(), vxx.seriesName()),
			number: v.pipe(v.string(), vxx.issueNumber()),
		}),
		releaseDate: v.pipe(v.string(), v.isoDate()),
		seriesId: v.pipe(v.string(), vx.ulid()),
	}),
	{
		abortEarly: true,
		abortPipeEarly: true,
	},
);

export declare namespace PutIssueItemInTable {
	type Props = {
		title: {
			publisher: string;
			series: string;
			number: string;
		};
		releaseDate: string;
		seriesId: string;
	};
}
