import {
	BatchProcessor,
	EventType,
	SqsFifoPartialProcessor,
	processPartialResponse,
	processPartialResponseSync,
} from '@aws-lambda-powertools/batch';

import { makeIdempotent } from '@aws-lambda-powertools/idempotency';
import {
	makeIdempotencyConfig,
	makeIdempotencyPersistenceStore,
} from '../idempotency';

import middy from '@middy/core';

import eventNormalizer from '@middy/event-normalizer';

import * as v from 'valibot';

import type { BaseSqsRecord } from './types';

import type { Idempotency } from '../idempotency';

import type { Context, SQSEvent } from 'aws-lambda';

export function makeSqs<TRecordSchema extends v.GenericSchema<BaseSqsRecord>>(
	recordSchema: TRecordSchema,
) {
	type Handler = (
		record: v.InferOutput<TRecordSchema>,
		context: Context,
	) => Promise<void>;

	return {
		handler(handler: Handler) {
			const batchProcessor = new BatchProcessor(EventType.SQS);

			return middy()
				.use(eventNormalizer())
				.handler((event: SQSEvent, context) =>
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
		idempotent(idempotency: Idempotency) {
			const idempotencyPersistenceStore = makeIdempotencyPersistenceStore(
				idempotency.tableName,
			);
			const idempotencyConfig = makeIdempotencyConfig(idempotency.options);

			return {
				handler(handler: Handler) {
					const batchProcessor = new BatchProcessor(EventType.SQS);

					return middy()
						.use(eventNormalizer())
						.handler((event: SQSEvent, context) => {
							idempotencyConfig.registerLambdaContext(context);

							return processPartialResponse(
								event,
								middy()
									.use(recordValidator(recordSchema))
									.handler(
										makeIdempotent(handler, {
											persistenceStore: idempotencyPersistenceStore,
											config: idempotencyConfig,
										}),
									),
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

export function makeSqsFifo<
	TRecordSchema extends v.GenericSchema<BaseSqsRecord>,
>(recordSchema: TRecordSchema) {
	type Handler = (
		record: v.InferOutput<TRecordSchema>,
		context: Context,
	) => Promise<void>;

	return {
		handler(handler: Handler) {
			const batchProcessor = new SqsFifoPartialProcessor();

			return middy()
				.use(eventNormalizer())
				.handler((event: SQSEvent, context) =>
					processPartialResponseSync(
						event,
						middy().use(recordValidator(recordSchema)).handler(handler),
						batchProcessor,
						{
							context,
						},
					),
				);
		},
		idempotent(idempotency: Idempotency) {
			const idempotencyPersistenceStore = makeIdempotencyPersistenceStore(
				idempotency.tableName,
			);
			const idempotencyConfig = makeIdempotencyConfig(idempotency.options);

			return {
				handler(handler: Handler) {
					const batchProcessor = new SqsFifoPartialProcessor();

					return middy()
						.use(eventNormalizer())
						.handler((event: SQSEvent, context) => {
							idempotencyConfig.registerLambdaContext(context);

							return processPartialResponseSync(
								event,
								middy()
									.use(recordValidator(recordSchema))
									.handler(
										makeIdempotent(handler, {
											persistenceStore: idempotencyPersistenceStore,
											config: idempotencyConfig,
										}),
									),
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

function recordValidator<TSchema extends v.GenericSchema<BaseSqsRecord>>(
	schema: TSchema,
): middy.MiddlewareObj<v.InferOutput<TSchema>> {
	return {
		before(request) {
			request.event = v.parse(schema, request.event, {
				abortEarly: true,
				abortPipeEarly: true,
			});
		},
	};
}
