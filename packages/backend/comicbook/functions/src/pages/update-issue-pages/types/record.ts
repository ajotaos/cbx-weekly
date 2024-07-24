import {
	s3EventNotificationEventBridgeEvent,
	sqsRecord,
} from '@cbx-weekly/backend-core-functions';

import * as v from 'valibot';

export const recordSchema = sqsRecord(
	s3EventNotificationEventBridgeEvent(v.literal('Object Created')),
);
