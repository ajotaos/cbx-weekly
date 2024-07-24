import {
	SERIES_UNIQUE_SLUG_TABLE_ITEM_PARTITION_KEY_CAPTURE_REGEX,
	SERIES_UNIQUE_SLUG_TABLE_ITEM_PARTITION_KEY_REGEX,
} from '../regex';

import * as v from '@cbx-weekly/backend-core-valibot';

export function seriesUniqueSlugPartitionKey<
	TInput extends string,
>(): v.RegexAction<TInput, undefined>;

export function seriesUniqueSlugPartitionKey<
	TInput extends string,
	const TMessage extends v.ErrorMessage<v.RegexIssue<TInput>> | undefined,
>(message: TMessage): v.RegexAction<TInput, TMessage>;

export function seriesUniqueSlugPartitionKey(
	message?: v.ErrorMessage<v.RegexIssue<string>>,
): v.RegexAction<string, v.ErrorMessage<v.RegexIssue<string>> | undefined> {
	return v.regex(
		SERIES_UNIQUE_SLUG_TABLE_ITEM_PARTITION_KEY_REGEX,
		message ??
			((issue) =>
				`Invalid series unique slug partition key: Received "${issue.input}"`),
	);
}

export function captureSeriesUniqueSlugPartitionKey(
	message?: v.ErrorMessage<v.RawTransformIssue<string>> | undefined,
) {
	return v.pipe(
		v.string(),
		v.captureRegex(
			SERIES_UNIQUE_SLUG_TABLE_ITEM_PARTITION_KEY_CAPTURE_REGEX,
			message ??
				((issue) =>
					`Invalid series unique slug partition key: Received "${issue.input}"`),
		),
		v.strictObject({
			slug: v.pipe(v.string(), v.slug()),
		}),
	);
}
