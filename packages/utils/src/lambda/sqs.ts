import {
	BatchProcessor,
	EventType,
	SqsFifoPartialProcessorAsync,
	processPartialResponse,
} from '@aws-lambda-powertools/batch';

import middy from '@middy/core';

import eventNormalizer from '@middy/event-normalizer';

import * as v from '@cbx-weekly/valibot/core';

import type { Context, SQSEvent } from 'aws-lambda';

export function makeSqs<
	TRecordSchema extends v.GenericSchema,
>(recordSchema: TRecordSchema) {
	return {
		recordHandler(
			handler: (
				record: v.InferOutput<TRecordSchema>,
				context: Context,
			) => Promise<void>,
		) {
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
	} as const;
}

export function makeSqsFifo<
	TRecordSchema extends v.GenericSchema,
>(recordSchema: TRecordSchema) {
	return {
		recordHandler(
			handler: (
				record: v.InferOutput<TRecordSchema>,
				context: Context,
			) => Promise<void>,
		) {
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
	} as const;
}

function recordValidator<
	TSchema extends v.GenericSchema,
>(schema: TSchema): middy.MiddlewareObj<v.InferOutput<TSchema>> {
	return {
		before(request) {
			request.event = v.parse(schema, request.event);
		},
	};
}
