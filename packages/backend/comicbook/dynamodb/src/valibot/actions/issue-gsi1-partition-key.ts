import {
	ISSUE_TABLE_ITEM_GSI1_PARTITION_KEY_CAPTURE_REGEX,
	ISSUE_TABLE_ITEM_GSI1_PARTITION_KEY_REGEX,
} from '../regex';

import * as v from '@cbx-weekly/backend-core-valibot';

export function issueGsi1PartitionKey<TInput extends string>(): v.RegexAction<
	TInput,
	undefined
>;

export function issueGsi1PartitionKey<
	TInput extends string,
	const TMessage extends v.ErrorMessage<v.RegexIssue<TInput>> | undefined,
>(message: TMessage): v.RegexAction<TInput, TMessage>;

export function issueGsi1PartitionKey(
	message?: v.ErrorMessage<v.RegexIssue<string>>,
): v.RegexAction<string, v.ErrorMessage<v.RegexIssue<string>> | undefined> {
	return v.regex(
		ISSUE_TABLE_ITEM_GSI1_PARTITION_KEY_REGEX,
		message ??
			((issue) =>
				`Invalid issue gsi1 partition key: Received "${issue.input}"`),
	);
}

export function captureIssueGsi1PartitionKey(
	message?: v.ErrorMessage<v.RawTransformIssue<string>> | undefined,
) {
	return v.pipe(
		v.string(),
		v.captureRegex(
			ISSUE_TABLE_ITEM_GSI1_PARTITION_KEY_CAPTURE_REGEX,
			message ??
				((issue) =>
					`Invalid issue gsi1 partition key: Received "${issue.input}"`),
		),
		v.strictObject({
			slug: v.pipe(v.string(), v.slug()),
		}),
	);
}
