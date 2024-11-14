import { ISSUE_GSI2_SORT_KEY_REGEX } from '../regex';

import * as v from '../../core';

const defaultMessage: v.ErrorMessage<v.GenericIssue<string>> = (issue) =>
	`Invalid issue gsi2 sk: Received "${issue.input}"`;

export function issueGsi2Sk<TInput extends string>(): v.RegexAction<
	TInput,
	undefined
>;

export function issueGsi2Sk<
	TInput extends string,
	const TMessage extends v.ErrorMessage<v.RegexIssue<TInput>> | undefined,
>(message: TMessage): v.RegexAction<TInput, TMessage>;

export function issueGsi2Sk(
	message?: v.ErrorMessage<v.RegexIssue<string>>,
): v.RegexAction<string, v.ErrorMessage<v.RegexIssue<string>> | undefined> {
	return v.regex(ISSUE_GSI2_SORT_KEY_REGEX, message ?? defaultMessage);
}

export const issueGsi2SkComponentsSchema = v.strictObject({
	slug: v.pipe(v.string(), v.slug()),
});

export type IssueGsi2SkComponents = v.InferOutput<
	typeof issueGsi2SkComponentsSchema
>;

export function captureIssueGsi2SkComponents(
	message?: v.ErrorMessage<v.RawTransformIssue<string>> | undefined,
): v.RawTransformAction<string, IssueGsi2SkComponents> {
	return v.captureRegex(
		ISSUE_GSI2_SORT_KEY_REGEX,
		message ?? defaultMessage,
	) as v.RawTransformAction<string, IssueGsi2SkComponents>;
}
