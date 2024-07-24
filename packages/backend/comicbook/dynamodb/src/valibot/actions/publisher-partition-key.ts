import {
	PUBLISHER_TABLE_ITEM_PARTITION_KEY_CAPTURE_REGEX,
	PUBLISHER_TABLE_ITEM_PARTITION_KEY_REGEX,
} from '../regex';

import * as v from '@cbx-weekly/backend-core-valibot';

export function publisherPartitionKey<TInput extends string>(): v.RegexAction<
	TInput,
	undefined
>;

export function publisherPartitionKey<
	TInput extends string,
	const TMessage extends v.ErrorMessage<v.RegexIssue<TInput>> | undefined,
>(message: TMessage): v.RegexAction<TInput, TMessage>;

export function publisherPartitionKey(
	message?: v.ErrorMessage<v.RegexIssue<string>>,
): v.RegexAction<string, v.ErrorMessage<v.RegexIssue<string>> | undefined> {
	return v.regex(
		PUBLISHER_TABLE_ITEM_PARTITION_KEY_REGEX,
		message ??
			((issue) => `Invalid publisher partition key: Received "${issue.input}"`),
	);
}

export function capturePublisherPartitionKey(
	message?: v.ErrorMessage<v.RawTransformIssue<string>> | undefined,
) {
	return v.pipe(
		v.string(),
		v.captureRegex(
			PUBLISHER_TABLE_ITEM_PARTITION_KEY_CAPTURE_REGEX,
			message ??
				((issue) =>
					`Invalid publisher partition key: Received "${issue.input}"`),
		),
		v.strictObject({
			id: v.pipe(v.string(), v.id()),
		}),
	);
}
