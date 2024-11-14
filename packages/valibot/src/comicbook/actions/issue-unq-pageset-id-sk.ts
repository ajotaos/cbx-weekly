import { ISSUE_UNIQUE_PAGESET_ID_SORT_KEY_REGEX } from '../regex';

import * as v from '../../core';

import type { EmptyObject } from 'type-fest';

const defaultMessage: v.ErrorMessage<v.GenericIssue<string>> = (issue) =>
	`Invalid issue unique pageset id sk: Received "${issue.input}"`;

export function issueUniquePagesetIdSk<TInput extends string>(): v.RegexAction<
	TInput,
	undefined
>;

export function issueUniquePagesetIdSk<
	TInput extends string,
	const TMessage extends v.ErrorMessage<v.RegexIssue<TInput>> | undefined,
>(message: TMessage): v.RegexAction<TInput, TMessage>;

export function issueUniquePagesetIdSk(
	message?: v.ErrorMessage<v.RegexIssue<string>>,
): v.RegexAction<string, v.ErrorMessage<v.RegexIssue<string>> | undefined> {
	return v.regex(
		ISSUE_UNIQUE_PAGESET_ID_SORT_KEY_REGEX,
		message ?? defaultMessage,
	);
}

export const issueUniquePagesetIdSkComponentsSchema = v.strictObject({});

export type IssueUniquePagesetIdSkComponents = EmptyObject;

export function captureIssueUniquePagesetIdSkComponents(
	message?: v.ErrorMessage<v.RawTransformIssue<string>> | undefined,
): v.RawTransformAction<string, IssueUniquePagesetIdSkComponents> {
	return v.captureRegex(
		ISSUE_UNIQUE_PAGESET_ID_SORT_KEY_REGEX,
		message ?? defaultMessage,
	) as v.RawTransformAction<string, IssueUniquePagesetIdSkComponents>;
}
