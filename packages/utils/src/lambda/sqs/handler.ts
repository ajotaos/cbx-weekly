import {
	BatchProcessor,
	EventType,
	SqsFifoPartialProcessorAsync,
	processPartialResponse,
	// processPartialResponseSync,
} from '@aws-lambda-powertools/batch';

import middy from '@middy/core';

import eventNormalizer from '@middy/event-normalizer';

import * as v from '@cbx-weekly/valibot/core';

import type { SqsRecord } from './types';

import type { Context, SQSEvent } from 'aws-lambda';

import type { PartialDeep } from 'type-fest';

export function makeSqs<
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
	};
}

export function makeSqsFifo<
	TRecordSchema extends v.GenericSchema<PartialDeep<SqsRecord>>,
>(recordSchema: TRecordSchema) {
	type Handler = (
		record: v.InferOutput<TRecordSchema>,
		context: Context,
	) => Promise<void>;

	return {
		recordHandler(handler: Handler) {
			const batchProcessor = new SqsFifoPartialProcessorAsync();

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
	};
}

function recordValidator<
	TSchema extends v.GenericSchema<PartialDeep<SqsRecord>>,
>(schema: TSchema): middy.MiddlewareObj<v.InferOutput<TSchema>> {
	return {
		before(request) {
			request.event = v.parse(schema, request.event);
		},
	};
}
