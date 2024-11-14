import {
	makeIssueGsi1Pk,
	makeIssueGsi1Sk,
	makeIssueGsi2Pk,
	makeIssueGsi2Sk,
	makeIssueGsi3PartitionKey,
	makeIssueGsi3SortKey,
	makeIssuePk,
	makeIssueSk,
} from './keys/issue';
import {
	makeIssueUniqueSlugPk,
	makeIssueUniqueSlugSk,
} from './keys/issue-unq-slug';
import { makeSeriesPk, makeSeriesSk } from './keys/series';

import { makeIssueSlug } from './slugs/issue';

import { Dynamodb } from '@cbx-weekly/utils/dynamodb';

import * as v_comicbook from '@cbx-weekly/valibot/comicbook';
import * as v from '@cbx-weekly/valibot/core';

import { ulid } from 'ulidx';

import type { DynamoDBClient } from '@aws-sdk/client-dynamodb';

export async function putIssue(
	props: PutIssue.Props,
	tableName: string,
	client: DynamoDBClient,
) {
	const seriesId = parseSeriesId(props.seriesId);

	const transaction = Dynamodb.createTransactionWriteBuilder(client);

	const title = parseIssueTitle(props.title);
	const releaseDate = parseReleaseDate(props.releaseDate);

	transaction.conditionCheck(
		{
			tableName,
			key: {
				Pk: makeSeriesPk({ id: seriesId }),
				Sk: makeSeriesSk(),
			},
			condition:
				'attribute_exists(#pk) AND #title.#publisher = :titlePublisher AND #title.#name = :titleName AND :releaseDate >= #releaseDate',
			attributes: {
				names: {
					'#pk': 'Pk',
					'#title': 'Title',
					'#publisher': 'Publisher',
					'#name': 'Name',
					'#releaseDate': 'ReleaseDate',
				},
				values: {
					':titlePublisher': title.publisher,
					':titleName': title.series,
					':releaseDate': releaseDate,
				},
			},
		},
		() => {
			throw Dynamodb.Errors.itemNotFound.make('series', {
				id: seriesId,
				title: {
					publisher: title.publisher,
					name: title.series,
				},
				releaseDate: `lte(${releaseDate})`,
			});
		},
	);

	const id = makeIssueId();
	const slug = makeIssueSlug(title);

	transaction.put(
		{
			tableName,
			item: {
				Pk: makeIssuePk({ id }),
				Sk: makeIssueSk(),
				Gsi1Pk: makeIssueGsi1Pk({ slug }),
				Gsi1Sk: makeIssueGsi1Sk(),
				Gsi2Pk: makeIssueGsi2Pk({ seriesId }),
				Gsi2Sk: makeIssueGsi2Sk({ slug }),
				Gsi3Pk: makeIssueGsi3PartitionKey({
					releaseWeek: releaseDate.substring(0, 8),
				}),
				Gsi3Sk: makeIssueGsi3SortKey({
					releaseWeekday: releaseDate.substring(9),
					slug,
				}),
				Id: id,
				Slug: slug,
				Title: {
					Publisher: title.publisher,
					Series: title.series,
					Number: title.number,
				},
				ReleaseDate: releaseDate,
				SeriesId: seriesId,
			},
			condition: 'attribute_not_exists(#pk)',
			attributes: {
				names: {
					'#pk': 'Pk',
				},
			},
		},
		() => {
			throw Dynamodb.Errors.itemAlreadyExists.make('issue', { id });
		},
	);

	transaction.put(
		{
			tableName,
			item: {
				Pk: makeIssueUniqueSlugPk({ slug }),
				Sk: makeIssueUniqueSlugSk(),
				Slug: slug,
				IssueId: id,
			},
			condition: 'attribute_not_exists(#pk)',
			attributes: {
				names: {
					'#pk': 'Pk',
				},
			},
		},
		() => {
			throw Dynamodb.Errors.itemAlreadyExists.make('issue', { slug });
		},
	);

	await transaction.execute();

	return { item: { id } };
}

function makeIssueId() {
	return ulid().toLowerCase();
}

const parseIssueTitle = v.parser(v_comicbook.issueTitleComponentsSchema);
const parseReleaseDate = v.parser(v.pipe(v.string(), v.isoWeekDate()));
const parseSeriesId = v.parser(v.pipe(v.string(), v.id()));

export declare namespace PutIssue {
	type Props = {
		title: v_comicbook.IssueTitleComponents;
		releaseDate: string;
		seriesId: string;
	};
}
