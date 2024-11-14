import { ISSUE_UNIQUE_SLUG_SORT_KEY_REGEX } from '../regex';

import * as v from '../../core';

import type { EmptyObject } from 'type-fest';

const defaultMessage: v.ErrorMessage<v.GenericIssue<string>> = (issue) =>
	`Invalid issue unique slug sk: Received "${issue.input}"`;

export function issueUniqueSlugSk<TInput extends string>(): v.RegexAction<
	TInput,
	undefined
>;

export function issueUniqueSlugSk<
	TInput extends string,
	const TMessage extends v.ErrorMessage<v.RegexIssue<TInput>> | undefined,
>(message: TMessage): v.RegexAction<TInput, TMessage>;

export function issueUniqueSlugSk(
	message?: v.ErrorMessage<v.RegexIssue<string>>,
): v.RegexAction<string, v.ErrorMessage<v.RegexIssue<string>> | undefined> {
	return v.regex(ISSUE_UNIQUE_SLUG_SORT_KEY_REGEX, message ?? defaultMessage);
}

export const issueUniqueSlugSkComponentsSchema = v.strictObject({});

export type IssueUniqueSlugSkComponents = EmptyObject;

export function captureIssueUniqueSlugSkComponents(
	message?: v.ErrorMessage<v.RawTransformIssue<string>> | undefined,
): v.RawTransformAction<string, IssueUniqueSlugSkComponents> {
	return v.captureRegex(
		ISSUE_UNIQUE_SLUG_SORT_KEY_REGEX,
		message ?? defaultMessage,
	) as v.RawTransformAction<string, IssueUniqueSlugSkComponents>;
}
