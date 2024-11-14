import { makeIssueGsi1Pk, makeIssueGsi1Sk } from './keys/issue';
import { issueSchema } from './types/issue';

import { makeIssueSlug } from './slugs/issue';

import { Dynamodb } from '@cbx-weekly/utils/dynamodb';

import * as v from '@cbx-weekly/valibot/core';

import type { DynamoDBClient } from '@aws-sdk/client-dynamodb';

import type { Simplify, UndefinedOnPartialDeep } from 'type-fest';

import type * as v_comicbook from '@cbx-weekly/valibot/comicbook';

export async function getIssueByTitle(
	props: GetIssueByTitle.Props,
	tableName: string,
	client: DynamoDBClient,
) {
	const slug = makeIssueSlug(props.title);

	return Dynamodb.queryItems(
		client,
		{
			tableName,
			indexName: 'Gsi1',
			keyCondition: '#gsi1pk = :gsi1pk AND #gsi1sk = :gsi1sk',
			filter:
				'#title.#publisher = :titlePublisher AND #title.#series = :titleSeries AND #title.#number = :titleNumber',
			attributes: {
				names: {
					'#gsi1pk': 'Gsi1Pk',
					'#gsi1sk': 'Gsi1Sk',
					'#title': 'Title',
					'#publisher': 'Publisher',
					'#series': 'Series',
					'#number': 'Number',
				},
				values: {
					':gsi1pk': makeIssueGsi1Pk({ slug }),
					':gsi1sk': makeIssueGsi1Sk(),
					':titlePublisher': props.title.publisher,
					':titleSeries': props.title.series,
					':titleNumber': props.title.number,
				},
			},
			limit: 1,
			consistentRead: props.consistentRead,
		},
		issueSchema,
		v.any(),
		v.any(),
	).then((output) => {
		if (output.items.length === 0) {
			throw Dynamodb.Errors.itemNotFound.make('issue', {
				title: {
					publisher: props.title.publisher,
					series: props.title.series,
					number: props.title.number,
				},
			});
		}

		return { item: output.items[0] };
	});
}

export declare namespace GetIssueByTitle {
	type Props = Simplify<
		{ title: v_comicbook.IssueTitleComponents } & UndefinedOnPartialDeep<
			Partial<{
				consistentRead: boolean;
			}>
		>
	>;
}
