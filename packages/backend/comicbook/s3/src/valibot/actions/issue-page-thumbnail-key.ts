import {
	ISSUE_PAGE_THUMBNAIL_BUCKET_OBJECT_KEY_CAPTURE_REGEX,
	ISSUE_PAGE_THUMBNAIL_BUCKET_OBJECT_KEY_REGEX,
} from '../regex';

import * as v from '@cbx-weekly/backend-core-valibot';

export function issuePageThumbnailKey<TInput extends string>(): v.RegexAction<
	TInput,
	undefined
>;

export function issuePageThumbnailKey<
	TInput extends string,
	const TMessage extends v.ErrorMessage<v.RegexIssue<TInput>> | undefined,
>(message: TMessage): v.RegexAction<TInput, TMessage>;

export function issuePageThumbnailKey(
	message?: v.ErrorMessage<v.RegexIssue<string>>,
): v.RegexAction<string, v.ErrorMessage<v.RegexIssue<string>> | undefined> {
	return v.regex(
		ISSUE_PAGE_THUMBNAIL_BUCKET_OBJECT_KEY_REGEX,
		message ??
			((issue) =>
				`Invalid issue page thumbnail key: Received "${issue.input}"`),
	);
}

export function captureIssuePageThumbnailKey(
	message?: v.ErrorMessage<v.RawTransformIssue<string>> | undefined,
) {
	return v.pipe(
		v.string(),
		v.captureRegex(
			ISSUE_PAGE_THUMBNAIL_BUCKET_OBJECT_KEY_CAPTURE_REGEX,
			message ??
				((issue) =>
					`Invalid issue page thumbnail key: Received "${issue.input}"`),
		),
		v.strictObject({
			id: v.pipe(v.string(), v.id()),
			issueId: v.pipe(v.string(), v.id()),
		}),
	);
}
