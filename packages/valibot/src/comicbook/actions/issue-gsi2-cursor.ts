import { ISSUE_GSI2_CURSOR_REGEX } from '../regex';

import * as v from '../../core';

const defaultMessage: v.ErrorMessage<v.GenericIssue<string>> = (issue) =>
	`Invalid issue gsi2 cursor: Received "${issue.input}"`;

export function issueGsi2Cursor<TInput extends string>(): v.RegexAction<
	TInput,
	undefined
>;

export function issueGsi2Cursor<
	TInput extends string,
	const TMessage extends v.ErrorMessage<v.RegexIssue<TInput>> | undefined,
>(message: TMessage): v.RegexAction<TInput, TMessage>;

export function issueGsi2Cursor(
	message?: v.ErrorMessage<v.RegexIssue<string>>,
): v.RegexAction<string, v.ErrorMessage<v.RegexIssue<string>> | undefined> {
	return v.regex(ISSUE_GSI2_CURSOR_REGEX, message ?? defaultMessage);
}

export const issueGsi2CursorComponentsSchema = v.strictObject({
	id: v.pipe(v.string(), v.id()),
	slug: v.pipe(v.string(), v.slug()),
	seriesId: v.pipe(v.string(), v.id()),
});

export type IssueGsi2CursorComponents = v.InferOutput<
	typeof issueGsi2CursorComponentsSchema
>;

export function captureIssueGsi2CursorComponents(
	message?: v.ErrorMessage<v.RawTransformIssue<string>> | undefined,
): v.RawTransformAction<string, IssueGsi2CursorComponents> {
	return v.captureRegex(
		ISSUE_GSI2_CURSOR_REGEX,
		message ?? defaultMessage,
	) as v.RawTransformAction<string, IssueGsi2CursorComponents>;
}
