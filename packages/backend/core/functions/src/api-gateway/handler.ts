import { Idempotency } from '../idempotency';

import { makeIdempotent } from '@aws-lambda-powertools/idempotency';

import middy from '@middy/core';

import httpContentEncoding from '@middy/http-content-encoding';
import httpContentNegotiation from '@middy/http-content-negotiation';
import httpCors from '@middy/http-cors';
import httpErrorHandler from '@middy/http-error-handler';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpHeaderNormalizer from '@middy/http-header-normalizer';
import httpResponseSerializer from '@middy/http-response-serializer';
import httpSecurityHeaders from '@middy/http-security-headers';
import httpUrlencodePathParametersParser from '@middy/http-urlencode-path-parser';

import { createError } from '@middy/util';

import * as v from '@cbx-weekly/backend-core-valibot';

import type { ApiGatewayEvent, ApiGatewayResult } from './types';

import type { APIGatewayProxyEventV2, Context } from 'aws-lambda';

import type { PartialDeep } from 'type-fest';

export function createApiGateway<
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	TEventSchema extends v.GenericSchema<PartialDeep<ApiGatewayEvent>, any>,
>(eventSchema: TEventSchema) {
	type Handler<TResult extends ApiGatewayResult> = (
		event: v.InferOutput<TEventSchema>,
		context: Context,
	) => Promise<TResult>;

	return {
		eventHandler<TResult extends ApiGatewayResult>(handler: Handler<TResult>) {
			return middy()
				.use(httpEventNormalizer())
				.use(httpHeaderNormalizer())
				.use(
					httpContentNegotiation({
						availableMediaTypes: ['application/json'],
					}),
				)
				.use(httpUrlencodePathParametersParser())
				.use(httpJsonBodyParser())
				.use(httpSecurityHeaders())
				.use(httpCors())
				.use(httpContentEncoding())
				.use(
					httpResponseSerializer({
						serializers: [
							{
								regex: /^application\/json$/,
								serializer: ({ body }) => JSON.stringify(body),
							},
						],
						defaultContentType: 'application/json',
					}),
				)
				.use(httpEventValidator(eventSchema))
				.use(
					httpErrorHandler({
						fallbackMessage: JSON.stringify({
							message: "Something went wrong. We're working on a fix.",
						}),
					}),
				)
				.handler(handler);
		},
		idempotent(tableName: string, options: Idempotency.Options) {
			const idempotency = Idempotency.create(tableName, options);

			return {
				eventHandler<TResult extends ApiGatewayResult>(
					handler: Handler<TResult>,
				) {
					return middy()
						.use(httpEventNormalizer())
						.use(httpHeaderNormalizer())
						.use(
							httpContentNegotiation({
								availableMediaTypes: ['application/json'],
							}),
						)
						.use(httpUrlencodePathParametersParser())
						.use(httpJsonBodyParser())
						.use(httpSecurityHeaders())
						.use(httpCors())
						.use(httpContentEncoding())
						.use(
							httpResponseSerializer({
								serializers: [
									{
										regex: /^application\/json$/,
										serializer: ({ body }) => JSON.stringify(body),
									},
								],
								defaultContentType: 'application/json',
							}),
						)
						.use(httpEventValidator(eventSchema))
						.use(
							httpErrorHandler({
								fallbackMessage: JSON.stringify({
									message: "Something went wrong. We're working on a fix.",
								}),
							}),
						)
						.handler(makeIdempotent(handler, idempotency));
				},
			};
		},
	};
}

function httpJsonBodyParser<
	TEventType extends APIGatewayProxyEventV2 = APIGatewayProxyEventV2,
>(): middy.MiddlewareObj<TEventType> {
	return {
		before(request) {
			const contentType =
				request.event.headers?.['Content-Type'] ??
				request.event.headers?.['content-type'];

			const contentTypePattern = /^application\/(.+\+)?json($|;.+)/;

			const body = request.event.body;

			if (contentType !== undefined) {
				if (!contentTypePattern.test(contentType)) {
					throw createError(
						415,
						JSON.stringify({
							message:
								"Unsupported 'Content-Type' header value. The media type provided is not supported by the server. Use a supported content type.",
						}),
						{
							cause: { package: '@middy/http-json-body-parser' },
						},
					);
				}

				if (body === undefined) {
					throw createError(
						400,
						JSON.stringify({
							message:
								"Request includes 'Content-Type' header, but no data is provided. Omit the header or include a valid body.",
						}),
						{
							cause: { package: '@middy/http-json-body-parser' },
						},
					);
				}
			}

			if (body !== undefined) {
				if (contentType === undefined) {
					throw createError(
						400,
						JSON.stringify({
							message:
								"Request body is provided, but 'Content-Type' header is missing. Please specify the content type.",
						}),
						{
							cause: { package: '@middy/http-json-body-parser' },
						},
					);
				}

				if (contentType === 'application/json') {
					try {
						const data = request.event.isBase64Encoded
							? Buffer.from(body, 'base64').toString()
							: body;

						request.event.body = JSON.parse(data);
					} catch (err) {
						throw createError(
							400,
							JSON.stringify({
								message:
									'Malformed JSON body. Please ensure the request body is valid JSON.',
							}),
							{
								cause: { package: '@middy/http-json-body-parser', data: err },
							},
						);
					}
				}
			}
		},
	};
}

function httpEventValidator<
	TSchema extends v.GenericSchema<PartialDeep<ApiGatewayEvent>>,
>(schema: TSchema): middy.MiddlewareObj<v.InferOutput<TSchema>> {
	return {
		before(request) {
			const parsedEventResult = v.safeParse(schema, request.event, {
				abortEarly: true,
				abortPipeEarly: true,
			});

			if (!parsedEventResult.success) {
				throw createError(
					422,
					JSON.stringify({
						message:
							'Invalid request. Please check the provided information for errors.',
						issues: v.flatten(parsedEventResult.issues),
					}),
					{
						cause: {
							package: 'valibot',
							data: parsedEventResult.issues,
						},
					},
				);
			}

			request.event = parsedEventResult.output;
		},
	};
}
