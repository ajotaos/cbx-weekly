import type {
	EventBridgeEvent as BaseEventBridgeEvent,
	S3NotificationEvent,
} from 'aws-lambda';

import type {
	Except,
	JsonValue,
	OverrideProperties,
	Simplify,
} from 'type-fest';

export type EventBridgeEvent = Simplify<
	Except<BaseEventBridgeEvent<string, unknown>, 'detail'> & {
		detail: JsonValue;
	}
>;

export type S3EventNotificationEventBridgeEvent = OverrideProperties<
	EventBridgeEvent,
	S3NotificationEvent
>;

// import * as v from 'valibot';

// import type { Jsonifiable } from 'type-fest';

// export function eventBridgeEvent<
// 	TDetailSchema extends v.GenericSchema<Jsonifiable>,
// 	TDetailTypeSchema extends v.GenericSchema<string>,
// 	TSource extends v.GenericSchema<string>,
// >(
// 	detailSchema: TDetailSchema,
// 	detailTypeSchema: TDetailTypeSchema,
// 	sourceSchema: TSource,
// ) {
// 	return v.object({
// 		...eventBridgeEventSchema.entries,
// 		source: sourceSchema,
// 		'detail-type': detailTypeSchema,
// 		detail: detailSchema,
// 	});
// }

// export function s3EventNotificationEventBridgeEvent<
// 	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
// 	TObjectKeySchema extends v.GenericSchema<string, any>,
// >(objectKeySchema: TObjectKeySchema) {
// 	return eventBridgeEvent(
// 		v.object({
// 			...s3EventNotificationEventBridgeEventDetailSchema.entries,
// 			object: v.object({
// 				...s3EventNotificationEventBridgeEventDetailSchema.entries.object
// 					.entries,
// 				key: objectKeySchema,
// 			}),
// 		}),
// 		v.string(),
// 		v.literal('aws.s3'),
// 	);
// }

// const eventBridgeEventSchema = v.object({
// 	version: v.string(),
// 	id: v.string(),
// 	source: v.string(),
// 	account: v.string(),
// 	time: v.pipe(v.string(), v.isoTimestamp()),
// 	region: v.string(),
// 	resources: v.array(v.string()),
// 	'detail-type': v.string(),
// 	detail: v.unknown(),
// 	'replay-name': v.optional(v.string()),
// });

// const s3EventNotificationEventBridgeEventDetailSchema = v.object({
// 	version: v.string(),
// 	bucket: v.object({
// 		name: v.string(),
// 	}),
// 	object: v.object({
// 		key: v.string(),
// 		size: v.optional(v.pipe(v.number(), v.minValue(0))), // not present in DeleteObject events
// 		etag: v.optional(v.string()), // not present in DeleteObject events
// 		'version-id': v.optional(v.string()),
// 		sequencer: v.optional(v.string()),
// 	}),
// 	'request-id': v.string(),
// 	requester: v.string(),
// 	'source-ip-address': v.optional(v.pipe(v.string(), v.ip())),
// 	reason: v.optional(v.string()),
// 	'deletion-type': v.optional(v.string()),
// 	'restore-expiry-time': v.optional(v.string()),
// 	'source-storage-class': v.optional(v.string()),
// 	'destination-storage-class': v.optional(v.string()),
// 	'destination-access-tier': v.optional(v.string()),
// });

// export type EventBridgeEvent = v.InferOutput<typeof eventBridgeEventSchema>;
