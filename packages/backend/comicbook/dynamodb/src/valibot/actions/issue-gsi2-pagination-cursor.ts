import {
	ISSUE_TABLE_ITEM_GSI2_PAGINATION_CURSOR_CAPTURE_REGEX,
	ISSUE_TABLE_ITEM_GSI2_PAGINATION_CURSOR_REGEX,
} from '../regex';

import * as v from '@cbx-weekly/backend-core-valibot';

export function issueGsi2PaginationCursor<
	TInput extends string,
>(): v.RegexAction<TInput, undefined>;

export function issueGsi2PaginationCursor<
	TInput extends string,
	const TMessage extends v.ErrorMessage<v.RegexIssue<TInput>> | undefined,
>(message: TMessage): v.RegexAction<TInput, TMessage>;

export function issueGsi2PaginationCursor(
	message?: v.ErrorMessage<v.RegexIssue<string>>,
): v.RegexAction<string, v.ErrorMessage<v.RegexIssue<string>> | undefined> {
	return v.regex(
		ISSUE_TABLE_ITEM_GSI2_PAGINATION_CURSOR_REGEX,
		message ??
			((issue) =>
				`Invalid issue gsi2 pagination cursor: Received "${issue.input}"`),
	);
}

export function captureIssueGsi2PaginationCursor(
	message?: v.ErrorMessage<v.RawTransformIssue<string>> | undefined,
) {
	return v.pipe(
		v.string(),
		v.captureRegex(
			ISSUE_TABLE_ITEM_GSI2_PAGINATION_CURSOR_CAPTURE_REGEX,
			message ??
				((issue) =>
					`Invalid issue gsi2 pagination cursor: Received "${issue.input}"`),
		),
		v.strictObject({
			id: v.pipe(v.string(), v.id()),
			slug: v.pipe(v.string(), v.slug()),
			seriesId: v.pipe(v.string(), v.id()),
		}),
	);
}
