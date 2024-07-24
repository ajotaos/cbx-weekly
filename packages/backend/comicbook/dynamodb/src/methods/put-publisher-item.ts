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

import {
	DynamoDBDocumentClient,
	TransactWriteCommand,
} from '@aws-sdk/lib-dynamodb';

import { ulid } from 'ulidx';

import * as v from '@cbx-weekly/backend-core-valibot';
import * as vx from '../valibot';

import type { Publisher } from '../types';

import type { TransactWriteCommandInput } from '@aws-sdk/lib-dynamodb';

import type { DynamoDBClient } from '@aws-sdk/client-dynamodb';

export async function putPublisherItemInTable(
	props: PutPublisherItemInTable.Props,
	tableName: string,
	client: DynamoDBClient,
) {
	const documentClient = DynamoDBDocumentClient.from(client);

	const { title } = parseProps(props);

	const id = ulid().toLowerCase();
	const slug = slugifyPublisherTitle(title);

	const transactItems: NonNullable<TransactWriteCommandInput['TransactItems']> =
		[];

	transactItems.push({
		Put: {
			TableName: tableName,
			Item: {
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
			} satisfies Publisher.TableItem.Raw,
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
				Pk: encodePublisherUniqueSlugTableItemPartitionKey({ slug }),
				Sk: encodePublisherUniqueSlugTableItemSortKey(),
				Id: id,
				Slug: slug,
			} satisfies Publisher.Unique.Slug.TableItem.Raw,
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
			name: v.pipe(v.string(), vx.publisherName()),
		}),
	}),
);

export declare namespace PutPublisherItemInTable {
	type Props = {
		title: {
			name: string;
		};
	};
}
