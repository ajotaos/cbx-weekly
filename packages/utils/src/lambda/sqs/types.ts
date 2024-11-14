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
