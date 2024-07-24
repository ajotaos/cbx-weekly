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
