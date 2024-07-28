import type { SQSRecord as BaseSqsRecord } from 'aws-lambda';

import type { Except, JsonValue, Simplify } from 'type-fest';

export type SqsRecord = Simplify<
	Except<
		BaseSqsRecord,
		'eventSource' | 'attributes' | 'messageAttributes' | 'body' | 'md5OfBody'
	> & {
		eventSource: 'aws:sqs';
		attributes: SqsRecordAttributes;
		messageAttributes: Record<string, SqsRecordMessageAttribute>;
		body: JsonValue;
	}
>;

export type SqsRecordMessageAttribute =
	| {
			dataType: 'String' | 'Number';
			stringValue: string;
	  }
	| {
			dataType: 'Binary';
			binaryValue: string;
	  };

export type SqsRecordAttributes = {
	AWSTraceHeader?: string;
	ApproximateReceiveCount: string;
	SentTimestamp: string;
	SenderId: string;
	ApproximateFirstReceiveTimestamp: string;
	SequenceNumber?: string;
	MessageGroupId?: string;
	MessageDeduplicationId?: string;
	DeadLetterQueueSourceArn?: string; // Undocumented, but used by AWS to support their re-drive functionality in the console
};

// import * as v from 'valibot';

// import type { Jsonifiable } from 'type-fest';

// export function sqsRecord<TBodySchema extends v.GenericSchema<Jsonifiable>>(
// 	bodySchema: TBodySchema,
// ) {
// 	return v.object({
// 		...sqsRecordSchema.entries,
// 		body: bodySchema,
// 	});
// }

// const sqsMessageAttributeSchema = v.object({
// 	stringValue: v.optional(v.string()),
// 	binaryValue: v.optional(v.string()),
// 	stringListValues: v.optional(v.array(v.string())),
// 	binaryListValues: v.optional(v.array(v.string())),
// 	dataType: v.string(),
// });

// const sqsAttributesSchema = v.object({
// 	ApproximateReceiveCount: v.string(),
// 	ApproximateFirstReceiveTimestamp: v.string(),
// 	MessageDeduplicationId: v.optional(v.string()),
// 	MessageGroupId: v.optional(v.string()),
// 	SenderId: v.string(),
// 	SentTimestamp: v.string(),
// 	SequenceNumber: v.optional(v.string()),
// 	AWSTraceHeader: v.optional(v.string()),
// 	/**
// 	 * Undocumented, but used by AWS to support their re-drive functionality in the console
// 	 */
// 	DeadLetterQueueSourceArn: v.optional(v.string()),
// });

// const sqsRecordSchema = v.object({
// 	messageId: v.string(),
// 	receiptHandle: v.string(),
// 	body: v.unknown(),
// 	attributes: sqsAttributesSchema,
// 	messageAttributes: v.record(v.string(), sqsMessageAttributeSchema),
// 	md5OfBody: v.string(),
// 	md5OfMessageAttributes: v.nullish(v.string()),
// 	eventSource: v.literal('aws:sqs'),
// 	eventSourceARN: v.string(),
// 	awsRegion: v.string(),
// });

// export type SqsRecord = v.InferOutput<typeof sqsRecordSchema>;
