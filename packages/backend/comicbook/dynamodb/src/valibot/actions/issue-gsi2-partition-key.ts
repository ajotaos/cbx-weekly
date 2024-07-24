import {
	ISSUE_TABLE_ITEM_GSI2_PARTITION_KEY_CAPTURE_REGEX,
	ISSUE_TABLE_ITEM_GSI2_PARTITION_KEY_REGEX,
} from '../regex';

import * as v from '@cbx-weekly/backend-core-valibot';

export function issueGsi2PartitionKey<TInput extends string>(): v.RegexAction<
	TInput,
	undefined
>;

export function issueGsi2PartitionKey<
	TInput extends string,
	const TMessage extends v.ErrorMessage<v.RegexIssue<TInput>> | undefined,
>(message: TMessage): v.RegexAction<TInput, TMessage>;

export function issueGsi2PartitionKey(
	message?: v.ErrorMessage<v.RegexIssue<string>>,
): v.RegexAction<string, v.ErrorMessage<v.RegexIssue<string>> | undefined> {
	return v.regex(
		ISSUE_TABLE_ITEM_GSI2_PARTITION_KEY_REGEX,
		message ??
			((issue) =>
				`Invalid issue gsi2 partition key: Received "${issue.input}"`),
	);
}

export function captureIssueGsi2PartitionKey(
	message?: v.ErrorMessage<v.RawTransformIssue<string>> | undefined,
) {
	return v.pipe(
		v.string(),
		v.captureRegex(
			ISSUE_TABLE_ITEM_GSI2_PARTITION_KEY_CAPTURE_REGEX,
			message ??
				((issue) =>
					`Invalid issue gsi2 partition key: Received "${issue.input}"`),
		),
		v.strictObject({
			seriesId: v.pipe(v.string(), v.id()),
		}),
	);
}
