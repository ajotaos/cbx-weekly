import {
	ISSUE_TABLE_ITEM_GSI3_PARTITION_KEY_CAPTURE_REGEX,
	ISSUE_TABLE_ITEM_GSI3_PARTITION_KEY_REGEX,
} from '../regex';

import * as v from '@cbx-weekly/backend-core-valibot';

export function issueGsi3PartitionKey<TInput extends string>(): v.RegexAction<
	TInput,
	undefined
>;

export function issueGsi3PartitionKey<
	TInput extends string,
	const TMessage extends v.ErrorMessage<v.RegexIssue<TInput>> | undefined,
>(message: TMessage): v.RegexAction<TInput, TMessage>;

export function issueGsi3PartitionKey(
	message?: v.ErrorMessage<v.RegexIssue<string>>,
): v.RegexAction<string, v.ErrorMessage<v.RegexIssue<string>> | undefined> {
	return v.regex(
		ISSUE_TABLE_ITEM_GSI3_PARTITION_KEY_REGEX,
		message ??
			((issue) =>
				`Invalid issue gsi3 partition key: Received "${issue.input}"`),
	);
}

export function captureIssueGsi3PartitionKey(
	message?: v.ErrorMessage<v.RawTransformIssue<string>> | undefined,
) {
	return v.pipe(
		v.string(),
		v.captureRegex(
			ISSUE_TABLE_ITEM_GSI3_PARTITION_KEY_CAPTURE_REGEX,
			message ??
				((issue) =>
					`Invalid issue gsi3 partition key: Received "${issue.input}"`),
		),
		v.strictObject({
			releaseDate: v.pipe(v.string(), v.isoDate()),
		}),
	);
}
