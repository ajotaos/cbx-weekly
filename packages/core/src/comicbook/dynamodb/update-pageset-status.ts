import { makePagesetPk, makePagesetSk } from './keys/pageset';

import { Dynamodb } from '@cbx-weekly/utils/dynamodb';

import { getUnixTime } from 'date-fns';

import { decodeTime, ulid } from 'ulidx';

import * as v from '@cbx-weekly/valibot/core';

import type { DynamoDBClient } from '@aws-sdk/client-dynamodb';

import type { Simplify } from 'type-fest';

export async function updatePagesetStatus(
	props: UpdatePagesetStatus.Props,
	tableName: string,
	client: DynamoDBClient,
) {
	const id = parsePagesetId(props.id);

	const updateId = makeUpdateId();

	if (props.status === 'pending') {
		const expiration = parseExpiration(
			typeof props.expiration === 'number'
				? props.expiration
				: props.expiration(getUnixTime(decodeTime(updateId))),
		);

		await Dynamodb.updateItem(
			client,
			{
				tableName,
				key: {
					Pk: makePagesetPk({ id }),
					Sk: makePagesetSk(),
				},
				update:
					'SET #status = :pending, #expiration = :expiration, #latestUpdate = :update',
				condition: 'attribute_exists(#pk) AND #status = :created',
				attributes: {
					names: {
						'#pk': 'Pk',
						'#status': 'Status',
						'#expiration': 'Expiration',
						'#latestUpdate': 'LatestUpdate',
					},
					values: {
						':pending': 'pending',
						':created': 'created',
						':expiration': expiration,
						':update': {
							Id: updateId,
							Type: 'status',
						},
					},
				},
			},
			() => {
				throw Dynamodb.Errors.itemNotFound.make('pageset', {
					id,
					status: 'created',
				});
			},
		);
	} else if (props.status === 'processing') {
		const expiration = parseExpiration(
			typeof props.expiration === 'number'
				? props.expiration
				: props.expiration(getUnixTime(decodeTime(updateId))),
		);

		await Dynamodb.updateItem(
			client,
			{
				tableName,
				key: {
					Pk: makePagesetPk({ id }),
					Sk: makePagesetSk(),
				},
				update:
					'SET #status = :processing, #expiration = :expiration, #latestUpdate = :update',
				condition: 'attribute_exists(#pk) AND #status = :pending',
				attributes: {
					names: {
						'#pk': 'Pk',
						'#status': 'Status',
						'#expiration': 'Expiration',
						'#latestUpdate': 'LatestUpdate',
					},
					values: {
						':processing': 'processing',
						':pending': 'pending',
						':expiration': expiration,
						':update': {
							Id: updateId,
							Type: 'status',
						},
					},
				},
			},
			() => {
				throw Dynamodb.Errors.itemNotFound.make('pageset', {
					id,
					status: 'pending',
				});
			},
		);
	} else if (props.status === 'ready') {
		await Dynamodb.updateItem(
			client,
			{
				tableName,
				key: {
					Pk: makePagesetPk({ id }),
					Sk: makePagesetSk(),
				},
				update:
					'SET #status = :ready, #latestUpdate = :update REMOVE #expiration',
				condition: 'attribute_exists(#pk) AND #status = :processing',
				attributes: {
					names: {
						'#pk': 'Pk',
						'#status': 'Status',
						'#expiration': 'Expiration',
						'#latestUpdate': 'LatestUpdate',
					},
					values: {
						':ready': 'ready',
						':processing': 'processing',
						':update': {
							Id: updateId,
							Type: 'status',
						},
					},
				},
			},
			() => {
				throw Dynamodb.Errors.itemNotFound.make('pageset', {
					id,
					status: 'processing',
				});
			},
		);
	} else if (props.status === 'failed') {
		const expiration = parseExpiration(
			typeof props.expiration === 'number'
				? props.expiration
				: props.expiration(getUnixTime(decodeTime(updateId))),
		);

		await Dynamodb.updateItem(
			client,
			{
				tableName,
				key: {
					Pk: makePagesetPk({ id }),
					Sk: makePagesetSk(),
				},
				update:
					'SET #status = :failed, #expiration = :expiration, #latestUpdate = :update',
				condition: 'attribute_exists(#pk) AND #status = :processing',
				attributes: {
					names: {
						'#pk': 'Pk',
						'#status': 'Status',
						'#expiration': 'Expiration',
						'#latestUpdate': 'LatestUpdate',
					},
					values: {
						':failed': 'failed',
						':processing': 'processing',
						':expiration': expiration,
						':update': {
							Id: updateId,
							Type: 'status',
						},
					},
				},
			},
			() => {
				throw Dynamodb.Errors.itemNotFound.make('pageset', {
					id,
					status: 'processing',
				});
			},
		);
	}
}

function makeUpdateId() {
	return ulid().toLowerCase();
}

const parseExpiration = v.parser(v.pipe(v.number(), v.integer()));
const parsePagesetId = v.parser(v.pipe(v.string(), v.id()));

export declare namespace UpdatePagesetStatus {
	type Props = Simplify<
		{
			id: string;
		} & (
			| {
					status: 'pending' | 'processing' | 'failed';
					expiration: number | ((currentTime: number) => number);
			  }
			| {
					status: 'ready';
			  }
		)
	>;
}
