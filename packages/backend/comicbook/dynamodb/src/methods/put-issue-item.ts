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

import {
	DynamoDBDocumentClient,
	TransactWriteCommand,
} from '@aws-sdk/lib-dynamodb';

import { ulid } from 'ulidx';

import * as v from '@cbx-weekly/backend-core-valibot';
import * as vx from '../valibot';

import type { Issue, Series } from '../types';

import type { TransactWriteCommandInput } from '@aws-sdk/lib-dynamodb';

import type { DynamoDBClient } from '@aws-sdk/client-dynamodb';

export async function putIssueItemInTable(
	props: PutIssueItemInTable.Props,
	tableName: string,
	client: DynamoDBClient,
) {
	const documentClient = DynamoDBDocumentClient.from(client);

	const { title, seriesId, releaseDate } = parseProps(props);

	const transactItems: NonNullable<TransactWriteCommandInput['TransactItems']> =
		[];

	transactItems.push({
		ConditionCheck: {
			TableName: tableName,
			Key: {
				Pk: encodeSeriesTableItemPartitionKey({ id: seriesId }),
				Sk: encodeSeriesTableItemSortKey(),
			} satisfies Pick<Series.TableItem.Raw, 'Pk' | 'Sk'>,
			ExpressionAttributeNames: {
				'#pk': 'Pk',
				'#title': 'Title',
				'#publisher': 'Publisher',
				'#name': 'Name',
			},
			ExpressionAttributeValues: {
				':titlePublisher': title.publisher,
				':titleSeries': title.series,
			},
			ConditionExpression:
				'attribute_exists(#pk) AND #title.#publisher = :titlePublisher AND #title.#name = :titleSeries',
		},
	});

	const id = ulid().toLowerCase();
	const slug = slugifyIssueTitle(title);

	transactItems.push({
		Put: {
			TableName: tableName,
			Item: {
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
				Pages: {},
				ReleaseDate: releaseDate,
				SeriesId: seriesId,
			} satisfies Issue.TableItem.Raw,
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
				Pk: encodeIssueUniqueSlugTableItemPartitionKey({ slug }),
				Sk: encodeIssueUniqueSlugTableItemSortKey(),
				Id: id,
				Slug: slug,
			} satisfies Issue.Unique.Slug.TableItem.Raw,
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
			series: v.pipe(v.string(), vx.seriesName()),
			number: v.pipe(v.string(), vx.issueNumber()),
		}),
		releaseDate: v.pipe(v.string(), v.isoDate()),
		seriesId: v.pipe(v.string(), v.ulid()),
	}),
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
