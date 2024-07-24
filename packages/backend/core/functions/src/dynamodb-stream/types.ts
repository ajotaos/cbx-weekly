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
