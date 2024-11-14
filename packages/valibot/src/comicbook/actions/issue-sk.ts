import { ISSUE_SORT_KEY_REGEX } from '../regex';

import * as v from '../../core';

import type { EmptyObject } from 'type-fest';

const defaultMessage: v.ErrorMessage<v.GenericIssue<string>> = (issue) =>
	`Invalid issue sk: Received "${issue.input}"`;

export function issueSk<TInput extends string>(): v.RegexAction<
	TInput,
	undefined
>;

export function issueSk<
	TInput extends string,
	const TMessage extends v.ErrorMessage<v.RegexIssue<TInput>> | undefined,
>(message: TMessage): v.RegexAction<TInput, TMessage>;

export function issueSk(
	message?: v.ErrorMessage<v.RegexIssue<string>>,
): v.RegexAction<string, v.ErrorMessage<v.RegexIssue<string>> | undefined> {
	return v.regex(ISSUE_SORT_KEY_REGEX, message ?? defaultMessage);
}

export const issueSkComponentsSchema = v.strictObject({});

export type IssueSkComponents = EmptyObject;

export function captureIssueSkComponents(
	message?: v.ErrorMessage<v.RawTransformIssue<string>> | undefined,
): v.RawTransformAction<string, IssueSkComponents> {
	return v.captureRegex(
		ISSUE_SORT_KEY_REGEX,
		message ?? defaultMessage,
	) as v.RawTransformAction<string, IssueSkComponents>;
}
