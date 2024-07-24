import {
	ISSUE_PAGES_ARCHIVE_BUCKET_OBJECT_KEY_CAPTURE_REGEX,
	ISSUE_PAGES_ARCHIVE_BUCKET_OBJECT_KEY_REGEX,
} from '../regex';

import * as v from '@cbx-weekly/backend-core-valibot';

export function issuePagesArchiveKey<TInput extends string>(): v.RegexAction<
	TInput,
	undefined
>;

export function issuePagesArchiveKey<
	TInput extends string,
	const TMessage extends v.ErrorMessage<v.RegexIssue<TInput>> | undefined,
>(message: TMessage): v.RegexAction<TInput, TMessage>;

export function issuePagesArchiveKey(
	message?: v.ErrorMessage<v.RegexIssue<string>>,
): v.RegexAction<string, v.ErrorMessage<v.RegexIssue<string>> | undefined> {
	return v.regex(
		ISSUE_PAGES_ARCHIVE_BUCKET_OBJECT_KEY_REGEX,
		message ??
			((issue) => `Invalid issue pages archive key: Received "${issue.input}"`),
	);
}

export function captureIssuePagesArchiveKey(
	message?: v.ErrorMessage<v.RawTransformIssue<string>> | undefined,
) {
	return v.pipe(
		v.string(),
		v.captureRegex(
			ISSUE_PAGES_ARCHIVE_BUCKET_OBJECT_KEY_CAPTURE_REGEX,
			message ??
				((issue) =>
					`Invalid issue pages archive key: Received "${issue.input}"`),
		),
		v.strictObject({
			id: v.pipe(v.string(), v.id()),
			issueId: v.pipe(v.string(), v.id()),
		}),
	);
}
