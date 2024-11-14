import { ISSUE_GSI1_SORT_KEY_REGEX } from '../regex';

import * as v from '../../core';

import type { EmptyObject } from 'type-fest';

const defaultMessage: v.ErrorMessage<v.GenericIssue<string>> = (issue) =>
	`Invalid issue gsi1 sk: Received "${issue.input}"`;

export function issueGsi1Sk<TInput extends string>(): v.RegexAction<
	TInput,
	undefined
>;

export function issueGsi1Sk<
	TInput extends string,
	const TMessage extends v.ErrorMessage<v.RegexIssue<TInput>> | undefined,
>(message: TMessage): v.RegexAction<TInput, TMessage>;

export function issueGsi1Sk(
	message?: v.ErrorMessage<v.RegexIssue<string>>,
): v.RegexAction<string, v.ErrorMessage<v.RegexIssue<string>> | undefined> {
	return v.regex(ISSUE_GSI1_SORT_KEY_REGEX, message ?? defaultMessage);
}

export const issueGsi1SkComponentsSchema = v.strictObject({});

export type IssueGsi1SkComponents = EmptyObject;

export function captureIssueGsi1SkComponents(
	message?: v.ErrorMessage<v.RawTransformIssue<string>> | undefined,
): v.RawTransformAction<string, IssueGsi1SkComponents> {
	return v.captureRegex(
		ISSUE_GSI1_SORT_KEY_REGEX,
		message ?? defaultMessage,
	) as v.RawTransformAction<string, IssueGsi1SkComponents>;
}
