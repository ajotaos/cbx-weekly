import { ISSUE_GSI3_SORT_KEY_REGEX } from '../regex';

import * as v from '../../core';

const defaultMessage: v.ErrorMessage<v.GenericIssue<string>> = (issue) =>
	`Invalid issue gsi3 sk: Received "${issue.input}"`;

export function issueGsi3Sk<TInput extends string>(): v.RegexAction<
	TInput,
	undefined
>;

export function issueGsi3Sk<
	TInput extends string,
	const TMessage extends v.ErrorMessage<v.RegexIssue<TInput>> | undefined,
>(message: TMessage): v.RegexAction<TInput, TMessage>;

export function issueGsi3Sk(
	message?: v.ErrorMessage<v.RegexIssue<string>>,
): v.RegexAction<string, v.ErrorMessage<v.RegexIssue<string>> | undefined> {
	return v.regex(ISSUE_GSI3_SORT_KEY_REGEX, message ?? defaultMessage);
}

export const issueGsi3SkComponentsSchema = v.strictObject({
	slug: v.pipe(v.string(), v.slug()),
	releaseWeekday: v.pipe(v.string(), v.isoWeekday()),
});

export type IssueGsi3SkComponents = v.InferOutput<
	typeof issueGsi3SkComponentsSchema
>;

export function captureIssueGsi3SkComponents(
	message?: v.ErrorMessage<v.RawTransformIssue<string>> | undefined,
): v.RawTransformAction<string, IssueGsi3SkComponents> {
	return v.captureRegex(
		ISSUE_GSI3_SORT_KEY_REGEX,
		message ?? defaultMessage,
	) as v.RawTransformAction<string, IssueGsi3SkComponents>;
}
