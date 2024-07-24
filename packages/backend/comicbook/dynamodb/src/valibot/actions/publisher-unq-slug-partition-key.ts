import {
	PUBLISHER_UNIQUE_SLUG_TABLE_ITEM_PARTITION_KEY_CAPTURE_REGEX,
	PUBLISHER_UNIQUE_SLUG_TABLE_ITEM_PARTITION_KEY_REGEX,
} from '../regex';

import * as v from '@cbx-weekly/backend-core-valibot';

export function publisherUniqueSlugPartitionKey<
	TInput extends string,
>(): v.RegexAction<TInput, undefined>;

export function publisherUniqueSlugPartitionKey<
	TInput extends string,
	const TMessage extends v.ErrorMessage<v.RegexIssue<TInput>> | undefined,
>(message: TMessage): v.RegexAction<TInput, TMessage>;

export function publisherUniqueSlugPartitionKey(
	message?: v.ErrorMessage<v.RegexIssue<string>>,
): v.RegexAction<string, v.ErrorMessage<v.RegexIssue<string>> | undefined> {
	return v.regex(
		PUBLISHER_UNIQUE_SLUG_TABLE_ITEM_PARTITION_KEY_REGEX,
		message ??
			((issue) =>
				`Invalid publisher unique slug partition key: Received "${issue.input}"`),
	);
}

export function capturePublisherUniqueSlugPartitionKey(
	message?: v.ErrorMessage<v.RawTransformIssue<string>> | undefined,
) {
	return v.pipe(
		v.string(),
		v.captureRegex(
			PUBLISHER_UNIQUE_SLUG_TABLE_ITEM_PARTITION_KEY_CAPTURE_REGEX,
			message ??
				((issue) =>
					`Invalid publisher unique slug partition key: Received "${issue.input}"`),
		),
		v.strictObject({
			slug: v.pipe(v.string(), v.slug()),
		}),
	);
}
