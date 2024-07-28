import type { DynamoDBRecord as BaseDynamodbRecord } from 'aws-lambda';

import type { Except, Merge, OverrideProperties, Simplify } from 'type-fest';

export type DynamodbStreamRecord = OverrideProperties<
	_DynamodbStreamRecord,
	| {
			eventName: 'INSERT';
			dynamodb: Merge<
				DynamodbStreamChangeRecord,
				| {
						StreamViewType: 'NEW_IMAGE' | 'NEW_AND_OLD_IMAGES';
						NewImage: Record<string, unknown>;
				  }
				| {
						StreamViewType: 'OLD_IMAGE' | 'KEYS_ONLY';
				  }
			>;
	  }
	| {
			eventName: 'MODIFY';
			dynamodb: Merge<
				DynamodbStreamChangeRecord,
				| {
						StreamViewType: 'NEW_IMAGE';
						NewImage: Record<string, unknown>;
				  }
				| {
						StreamViewType: 'NEW_AND_OLD_IMAGES';
						NewImage: Record<string, unknown>;
						OldImage: Record<string, unknown>;
				  }
				| {
						StreamViewType: 'OLD_IMAGE';
						OldImage: Record<string, unknown>;
				  }
				| {
						StreamViewType: 'KEYS_ONLY';
				  }
			>;
	  }
	| {
			eventName: 'REMOVE';
			dynamodb: Merge<
				DynamodbStreamChangeRecord,
				| {
						StreamViewType: 'OLD_IMAGE' | 'NEW_AND_OLD_IMAGES';
						OldImage: Record<string, unknown>;
				  }
				| {
						StreamViewType: 'NEW_IMAGE' | 'KEYS_ONLY';
				  }
			>;
	  }
>;

export type _DynamodbStreamRecord = Simplify<
	Except<
		BaseDynamodbRecord,
		'eventSource' | 'eventName' | 'userIdentity' | 'dynamodb'
	>
> & {
	eventSource: 'aws:dynamodb';
	eventName: DynamodbRecordEventName;
	userIdentity?: DynamodbRecordUserIdentity;
	dynamodb: DynamodbStreamChangeRecord;
};

export type DynamodbRecordEventName = 'INSERT' | 'MODIFY' | 'REMOVE';

export type DynamodbRecordUserIdentity = {
	type: 'Service';
	principalId: 'dynamodb.amazonaws.com';
};

export type DynamodbStreamChangeRecord = {
	ApproximateCreationDateTime?: number;
	Keys: Record<string, Record<string, string | number | symbol>>;
	NewImage: never;
	OldImage: never;
	SequenceNumber: string;
	SizeBytes: number;
	StreamViewType: DynamodbStreamViewType;
};

export type DynamodbStreamViewType =
	| 'NEW_IMAGE'
	| 'OLD_IMAGE'
	| 'NEW_AND_OLD_IMAGES'
	| 'KEYS_ONLY';

// const userIdentitySchema = v.object({
// 	type: v.picklist(['Service']),
// 	principalId: v.literal('dynamodb.amazonaws.com'),
// });

// export type SqsRecord = Simplify<
// 	Except<BaseSqsRecord, 'eventSource' | 'messageAttributes' | 'body' | 'md5OfBody'> & {
// 		eventSource: 'aws:sqs',
// 		messageAttributes: Record<string, SqsRecordMessageAttribute>;
// 		body: JsonValue;
// 	}
// >;

// import * as v from 'valibot';

// import type { NativeAttributeValue } from '@aws-sdk/util-dynamodb';

// export function dynamodbStreamRecord<
// 	TImageSchema extends v.GenericSchema<Record<string, NativeAttributeValue>>,
// 	TKeysSchema extends v.GenericSchema<Record<string, NativeAttributeValue>>,
// >(imageSchema: TImageSchema, keysSchema: TKeysSchema) {
// 	return v.object({
// 		...dynamodbStreamRecordSchema.entries,
// 		dynamodb: v.object({
// 			...dynamodbStreamRecordSchema.entries.dynamodb.entries,
// 			Keys: keysSchema,
// 			NewImage: v.optional(imageSchema),
// 			OldImage: v.optional(imageSchema),
// 		}),
// 	});
// }

// const dynamodbStreamChangeRecordSchema = v.object({
// 	ApproximateCreationDateTime: v.optional(v.number()),
// 	Keys: v.record(v.string(), v.record(v.string(), v.any())),
// 	NewImage: v.optional(v.record(v.string(), v.any())),
// 	OldImage: v.optional(v.record(v.string(), v.any())),
// 	SequenceNumber: v.string(),
// 	SizeBytes: v.number(),
// 	StreamViewType: v.picklist([
// 		'NEW_IMAGE',
// 		'OLD_IMAGE',
// 		'NEW_AND_OLD_IMAGES',
// 		'KEYS_ONLY',
// 	]),
// });

// const userIdentitySchema = v.object({
// 	type: v.picklist(['Service']),
// 	principalId: v.literal('dynamodb.amazonaws.com'),
// });

// const dynamodbStreamRecordSchema = v.object({
// 	eventID: v.string(),
// 	eventName: v.picklist(['INSERT', 'MODIFY', 'REMOVE']),
// 	eventVersion: v.string(),
// 	eventSource: v.literal('aws:dynamodb'),
// 	awsRegion: v.string(),
// 	eventSourceARN: v.string(),
// 	dynamodb: dynamodbStreamChangeRecordSchema,
// 	userIdentity: v.optional(userIdentitySchema),
// });

// export type DynamodbStreamRecord = v.InferOutput<
// 	typeof dynamodbStreamRecordSchema
// >;
