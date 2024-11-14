import { PAGESET_GSI1_CURSOR_REGEX } from '../regex';

import * as v from '../../core';

const defaultMessage: v.ErrorMessage<v.GenericIssue<string>> = (issue) =>
	`Invalid pageset gsi1 cursor: Received "${issue.input}"`;

export function pagesetGsi1Cursor<TInput extends string>(): v.RegexAction<
	TInput,
	undefined
>;

export function pagesetGsi1Cursor<
	TInput extends string,
	const TMessage extends v.ErrorMessage<v.RegexIssue<TInput>> | undefined,
>(message: TMessage): v.RegexAction<TInput, TMessage>;

export function pagesetGsi1Cursor(
	message?: v.ErrorMessage<v.RegexIssue<string>>,
): v.RegexAction<string, v.ErrorMessage<v.RegexIssue<string>> | undefined> {
	return v.regex(PAGESET_GSI1_CURSOR_REGEX, message ?? defaultMessage);
}

export const pagesetGsi1CursorComponentsSchema = v.strictObject({
	id: v.pipe(v.string(), v.id()),
	created: v.pipe(v.string(), v.epoch()),
	issueId: v.pipe(v.string(), v.id()),
});

export type PagesetGsi1CursorComponents = v.InferOutput<
	typeof pagesetGsi1CursorComponentsSchema
>;

export function capturePagesetGsi1CursorComponents(
	message?: v.ErrorMessage<v.RawTransformIssue<string>> | undefined,
): v.RawTransformAction<string, PagesetGsi1CursorComponents> {
	return v.captureRegex(
		PAGESET_GSI1_CURSOR_REGEX,
		message ?? defaultMessage,
	) as v.RawTransformAction<string, PagesetGsi1CursorComponents>;
}
