import {
	issueTableItemKeys,
	issueUniqueSlugTableItemKeys,
	seriesTableItemKeys,
} from '../keys';

import { makeIssueSlug } from '../slug';

import { TransactWriteItemsCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';

import { ulid } from 'ulidx';

import * as vx from '@cbx-weekly/backend-comicbook-valibot';
import * as v from 'valibot';

import type {
	RawIssueTableItem,
	RawIssueUniqueSlugTableItem,
	RawSeriesTableItem,
} from '../types';

import type {
	DynamoDBClient,
	TransactWriteItem,
} from '@aws-sdk/client-dynamodb';

export type PutIssueItemInTableProps = {
	title: {
		publisher: string;
		series: string;
		number: string;
	};
	seriesId: string;
	releaseDate: string;
};

export async function putIssueItemInTable(
	props: PutIssueItemInTableProps,
	tableName: string,
	client: DynamoDBClient,
) {
	const { title, seriesId, releaseDate } = parseProps(props);

	const transactItems: Array<TransactWriteItem> = [];

	const rawSeriesItemKey = {
		Pk: seriesTableItemKeys.makePk({ id: seriesId }),
		Sk: seriesTableItemKeys.makeSk(),
	} satisfies Pick<RawSeriesTableItem, 'Pk' | 'Sk'>;

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

	const id = ulid();
	const slug = makeIssueSlug(title);

	const rawIssueItem = {
		Pk: issueTableItemKeys.makePk({ id }),
		Sk: issueTableItemKeys.makeSk(),
		Gsi1Pk: issueTableItemKeys.makeGsi1Pk({ slug }),
		Gsi1Sk: issueTableItemKeys.makeGsi1Sk(),
		Gsi2Pk: issueTableItemKeys.makeGsi2Pk({ seriesId }),
		Gsi2Sk: issueTableItemKeys.makeGsi2Sk({ slug }),
		Gsi3Pk: issueTableItemKeys.makeGsi3Pk({ releaseDate }),
		Gsi3Sk: issueTableItemKeys.makeGsi3Sk({ slug }),
		Id: id,
		Slug: slug,
		Title: {
			Publisher: title.publisher,
			Series: title.series,
			Number: title.number,
		},
		SeriesId: seriesId,
		ReleaseDate: releaseDate,
		Pages: {
			State: 'pending',
		},
	} satisfies RawIssueTableItem;

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

	const rawIssueUniqueSlugItem = {
		Pk: issueUniqueSlugTableItemKeys.makePk({ slug }),
		Sk: issueUniqueSlugTableItemKeys.makeSk(),
		Id: id,
		Slug: slug,
	} satisfies RawIssueUniqueSlugTableItem;

	transactItems.push({
		Put: {
			TableName: tableName,
			Item: marshall(rawIssueUniqueSlugItem),
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
		series: v.pipe(v.string(), vx.seriesName()),
		number: v.pipe(v.string(), vx.issueNumber()),
	}),
	seriesId: v.pipe(v.string(), vx.ulid()),
	releaseDate: v.pipe(v.string(), v.isoDate()),
});
