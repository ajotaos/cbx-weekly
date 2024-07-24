import { Idempotency } from '../idempotency';

import {
	BatchProcessor,
	EventType,
	processPartialResponse,
} from '@aws-lambda-powertools/batch';

import { makeIdempotent } from '@aws-lambda-powertools/idempotency';

import middy from '@middy/core';

import eventNormalizer from '@middy/event-normalizer';

import * as v from '@cbx-weekly/backend-core-valibot';

import type { DynamodbStreamRecord } from './types';

import type { Context, DynamoDBStreamEvent } from 'aws-lambda';

import type { PartialDeep } from 'type-fest';

export function createDynamodbStream<
	TRecordSchema extends v.GenericSchema<PartialDeep<DynamodbStreamRecord>>,
>(recordSchema: TRecordSchema) {
	type Handler = (
		record: v.InferOutput<TRecordSchema>,
		context: Context,
	) => Promise<void>;

	return {
		recordHandler(handler: Handler) {
			const batchProcessor = new BatchProcessor(EventType.DynamoDBStreams);

			return middy()
				.use(eventNormalizer())
				.handler((event: DynamoDBStreamEvent, context) =>
					processPartialResponse(
						event,
						middy().use(recordValidator(recordSchema)).handler(handler),
						batchProcessor,
						{
							context,
						},
					),
				);
		},
		idempotent(tableName: string, options: Idempotency.Options) {
			const idempotency = Idempotency.create(tableName, options);

			return {
				recordHandler(handler: Handler) {
					const batchProcessor = new BatchProcessor(EventType.DynamoDBStreams);

					return middy()
						.use(eventNormalizer())
						.handler((event: DynamoDBStreamEvent, context) => {
							idempotency.config.registerLambdaContext(context);

							return processPartialResponse(
								event,
								middy()
									.use(recordValidator(recordSchema))
									.handler(makeIdempotent(handler, idempotency)),
								batchProcessor,
								{
									context,
								},
							);
						});
				},
			};
		},
	};
}

function recordValidator<
	TSchema extends v.GenericSchema<PartialDeep<DynamodbStreamRecord>>,
>(schema: TSchema): middy.MiddlewareObj<v.InferOutput<TSchema>> {
	return {
		before(request) {
			request.event = v.parse(schema, request.event, {
				abortEarly: true,
				abortPipeEarly: true,
			});
		},
	};
}
