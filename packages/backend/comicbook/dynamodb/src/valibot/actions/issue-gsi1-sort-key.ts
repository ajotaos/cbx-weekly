import { ISSUE_TABLE_ITEM_GSI1_SORT_KEY_REGEX } from '../regex';

import * as v from '@cbx-weekly/backend-core-valibot';

export function issueGsi1SortKey<TInput extends string>(): v.RegexAction<
	TInput,
	undefined
>;

export function issueGsi1SortKey<
	TInput extends string,
	const TMessage extends v.ErrorMessage<v.RegexIssue<TInput>> | undefined,
>(message: TMessage): v.RegexAction<TInput, TMessage>;

export function issueGsi1SortKey(
	message?: v.ErrorMessage<v.RegexIssue<string>>,
): v.RegexAction<string, v.ErrorMessage<v.RegexIssue<string>> | undefined> {
	return v.regex(
		ISSUE_TABLE_ITEM_GSI1_SORT_KEY_REGEX,
		message ??
			((issue) => `Invalid issue gsi1 sort key: Received "${issue.input}"`),
	);
}

export function captureIssueGsi1SortKey(
	message?: v.ErrorMessage<v.RawTransformIssue<string>> | undefined,
) {
	return v.pipe(
		v.string(),
		v.captureRegex(
			ISSUE_TABLE_ITEM_GSI1_SORT_KEY_REGEX,
			message ??
				((issue) => `Invalid issue gsi1 sort key: Received "${issue.input}"`),
		),
		v.strictObject({}),
	);
}
