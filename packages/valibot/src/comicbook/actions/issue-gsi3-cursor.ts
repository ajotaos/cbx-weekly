import { ISSUE_GSI3_CURSOR_REGEX } from '../regex';

import * as v from '../../core';

const defaultMessage: v.ErrorMessage<v.GenericIssue<string>> = (issue) =>
	`Invalid issue gsi3 cursor: Received "${issue.input}"`;

export function issueGsi3Cursor<TInput extends string>(): v.RegexAction<
	TInput,
	undefined
>;

export function issueGsi3Cursor<
	TInput extends string,
	const TMessage extends v.ErrorMessage<v.RegexIssue<TInput>> | undefined,
>(message: TMessage): v.RegexAction<TInput, TMessage>;

export function issueGsi3Cursor(
	message?: v.ErrorMessage<v.RegexIssue<string>>,
): v.RegexAction<string, v.ErrorMessage<v.RegexIssue<string>> | undefined> {
	return v.regex(ISSUE_GSI3_CURSOR_REGEX, message ?? defaultMessage);
}

export const issueGsi3CursorComponentsSchema = v.strictObject({
	id: v.pipe(v.string(), v.id()),
	slug: v.pipe(v.string(), v.slug()),
	releaseDate: v.pipe(v.string(), v.isoWeekDate()),
});

export type IssueGsi3CursorComponents = v.InferOutput<
	typeof issueGsi3CursorComponentsSchema
>;

export function captureIssueGsi3CursorComponents(
	message?: v.ErrorMessage<v.RawTransformIssue<string>> | undefined,
): v.RawTransformAction<string, IssueGsi3CursorComponents> {
	return v.captureRegex(
		ISSUE_GSI3_CURSOR_REGEX,
		message ?? defaultMessage,
	) as v.RawTransformAction<string, IssueGsi3CursorComponents>;
}
