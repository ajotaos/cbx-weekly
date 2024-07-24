import {
	SERIES_TABLE_ITEM_GSI2_PARTITION_KEY_CAPTURE_REGEX,
	SERIES_TABLE_ITEM_GSI2_PARTITION_KEY_REGEX,
} from '../regex';

import * as v from '@cbx-weekly/backend-core-valibot';

export function seriesGsi2PartitionKey<TInput extends string>(): v.RegexAction<
	TInput,
	undefined
>;

export function seriesGsi2PartitionKey<
	TInput extends string,
	const TMessage extends v.ErrorMessage<v.RegexIssue<TInput>> | undefined,
>(message: TMessage): v.RegexAction<TInput, TMessage>;

export function seriesGsi2PartitionKey(
	message?: v.ErrorMessage<v.RegexIssue<string>>,
): v.RegexAction<string, v.ErrorMessage<v.RegexIssue<string>> | undefined> {
	return v.regex(
		SERIES_TABLE_ITEM_GSI2_PARTITION_KEY_REGEX,
		message ??
			((issue) =>
				`Invalid series gsi2 partition key: Received "${issue.input}"`),
	);
}

export function captureSeriesGsi2PartitionKey(
	message?: v.ErrorMessage<v.RawTransformIssue<string>> | undefined,
) {
	return v.pipe(
		v.string(),
		v.captureRegex(
			SERIES_TABLE_ITEM_GSI2_PARTITION_KEY_CAPTURE_REGEX,
			message ??
				((issue) =>
					`Invalid series gsi2 partition key: Received "${issue.input}"`),
		),
		v.strictObject({
			publisherId: v.pipe(v.string(), v.id()),
		}),
	);
}
