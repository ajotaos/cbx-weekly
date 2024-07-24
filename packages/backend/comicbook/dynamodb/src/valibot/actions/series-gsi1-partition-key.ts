import {
	SERIES_TABLE_ITEM_GSI1_PARTITION_KEY_CAPTURE_REGEX,
	SERIES_TABLE_ITEM_GSI1_PARTITION_KEY_REGEX,
} from '../regex';

import * as v from '@cbx-weekly/backend-core-valibot';

export function seriesGsi1PartitionKey<TInput extends string>(): v.RegexAction<
	TInput,
	undefined
>;

export function seriesGsi1PartitionKey<
	TInput extends string,
	const TMessage extends v.ErrorMessage<v.RegexIssue<TInput>> | undefined,
>(message: TMessage): v.RegexAction<TInput, TMessage>;

export function seriesGsi1PartitionKey(
	message?: v.ErrorMessage<v.RegexIssue<string>>,
): v.RegexAction<string, v.ErrorMessage<v.RegexIssue<string>> | undefined> {
	return v.regex(
		SERIES_TABLE_ITEM_GSI1_PARTITION_KEY_REGEX,
		message ??
			((issue) =>
				`Invalid series gsi1 partition key: Received "${issue.input}"`),
	);
}

export function captureSeriesGsi1PartitionKey(
	message?: v.ErrorMessage<v.RawTransformIssue<string>> | undefined,
) {
	return v.pipe(
		v.string(),
		v.captureRegex(
			SERIES_TABLE_ITEM_GSI1_PARTITION_KEY_CAPTURE_REGEX,
			message ??
				((issue) =>
					`Invalid series gsi1 partition key: Received "${issue.input}"`),
		),
		v.strictObject({
			slug: v.pipe(v.string(), v.slug()),
		}),
	);
}
