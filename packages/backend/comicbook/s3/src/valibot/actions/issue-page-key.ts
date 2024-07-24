import {
	ISSUE_PAGE_BUCKET_OBJECT_KEY_CAPTURE_REGEX,
	ISSUE_PAGE_BUCKET_OBJECT_KEY_REGEX,
} from '../regex';

import * as v from '@cbx-weekly/backend-core-valibot';

export function issuePageKey<TInput extends string>(): v.RegexAction<
	TInput,
	undefined
>;

export function issuePageKey<
	TInput extends string,
	const TMessage extends v.ErrorMessage<v.RegexIssue<TInput>> | undefined,
>(message: TMessage): v.RegexAction<TInput, TMessage>;

export function issuePageKey(
	message?: v.ErrorMessage<v.RegexIssue<string>>,
): v.RegexAction<string, v.ErrorMessage<v.RegexIssue<string>> | undefined> {
	return v.regex(
		ISSUE_PAGE_BUCKET_OBJECT_KEY_REGEX,
		message ?? ((issue) => `Invalid issue page key: Received "${issue.input}"`),
	);
}

export function captureIssuePageKey(
	message?: v.ErrorMessage<v.RawTransformIssue<string>> | undefined,
) {
	return v.pipe(
		v.string(),
		v.captureRegex(
			ISSUE_PAGE_BUCKET_OBJECT_KEY_CAPTURE_REGEX,
			message ??
				((issue) => `Invalid issue page key: Received "${issue.input}"`),
		),
		v.strictObject({
			id: v.pipe(v.string(), v.id()),
			issueId: v.pipe(v.string(), v.id()),
		}),
	);
}
