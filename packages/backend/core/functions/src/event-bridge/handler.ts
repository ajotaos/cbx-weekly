import { Idempotency } from '../idempotency';

import { makeIdempotent } from '@aws-lambda-powertools/idempotency';

import middy from '@middy/core';

import * as v from '@cbx-weekly/backend-core-valibot';

import type { EventBridgeEvent } from './types';

import type { Context } from 'aws-lambda';

import type { PartialDeep } from 'type-fest';

export function createEventBridge<
	TEventSchema extends v.GenericSchema<PartialDeep<EventBridgeEvent>>,
>(eventSchema: TEventSchema) {
	type Handler = (
		record: v.InferOutput<TEventSchema>,
		context: Context,
	) => Promise<void>;

	return {
		eventHandler(handler: Handler) {
			return middy().use(eventValidator(eventSchema)).handler(handler);
		},
		idempotent(tableName: string, options: Idempotency.Options) {
			const idempotency = Idempotency.create(tableName, options);

			return {
				eventHandler(handler: Handler) {
					return middy()
						.use(eventValidator(eventSchema))
						.handler(makeIdempotent(handler, idempotency));
				},
			};
		},
	};
}

function eventValidator<
	TSchema extends v.GenericSchema<PartialDeep<EventBridgeEvent>>,
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
