import { Idempotency } from '../idempotency';

import {
	BatchProcessor,
	EventType,
	SqsFifoPartialProcessor,
	processPartialResponse,
	processPartialResponseSync,
} from '@aws-lambda-powertools/batch';

import { makeIdempotent } from '@aws-lambda-powertools/idempotency';

import middy from '@middy/core';

import eventNormalizer from '@middy/event-normalizer';

import * as v from 'valibot';

import type { SqsRecord } from './types';

import type { Context, SQSEvent } from 'aws-lambda';

import type { PartialDeep } from 'type-fest';

export function createSqs<
	TRecordSchema extends v.GenericSchema<PartialDeep<SqsRecord>>,
>(recordSchema: TRecordSchema) {
	type Handler = (
		record: v.InferOutput<TRecordSchema>,
		context: Context,
	) => Promise<void>;

	return {
		recordHandler(handler: Handler) {
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
		idempotent(tableName: string, options: Idempotency.Options) {
			const idempotency = Idempotency.create(tableName, options);

			return {
				recordHandler(handler: Handler) {
					const batchProcessor = new BatchProcessor(EventType.SQS);

					return middy()
						.use(eventNormalizer())
						.handler((event: SQSEvent, context) => {
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

export function createSqsFifo<
	TRecordSchema extends v.GenericSchema<PartialDeep<SqsRecord>>,
>(recordSchema: TRecordSchema) {
	type Handler = (
		record: v.InferOutput<TRecordSchema>,
		context: Context,
	) => Promise<void>;

	return {
		recordHandler(handler: Handler) {
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
		idempotent(tableName: string, options: Idempotency.Options) {
			const idempotency = Idempotency.create(tableName, options);

			return {
				recordHandler(handler: Handler) {
					const batchProcessor = new SqsFifoPartialProcessor();

					return middy()
						.use(eventNormalizer())
						.handler((event: SQSEvent, context) => {
							idempotency.config.registerLambdaContext(context);

							return processPartialResponseSync(
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
	TSchema extends v.GenericSchema<PartialDeep<SqsRecord>>,
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
