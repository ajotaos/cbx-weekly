import { ISSUE_GSI1_PARTITION_KEY_REGEX } from '../regex';

import * as v from '../../core';

const defaultMessage: v.ErrorMessage<v.GenericIssue<string>> = (issue) =>
	`Invalid issue gsi1 pk: Received "${issue.input}"`;

export function issueGsi1Pk<TInput extends string>(): v.RegexAction<
	TInput,
	undefined
>;

export function issueGsi1Pk<
	TInput extends string,
	const TMessage extends v.ErrorMessage<v.RegexIssue<TInput>> | undefined,
>(message: TMessage): v.RegexAction<TInput, TMessage>;

export function issueGsi1Pk(
	message?: v.ErrorMessage<v.RegexIssue<string>>,
): v.RegexAction<string, v.ErrorMessage<v.RegexIssue<string>> | undefined> {
	return v.regex(ISSUE_GSI1_PARTITION_KEY_REGEX, message ?? defaultMessage);
}

export const issueGsi1PkComponentsSchema = v.strictObject({
	slug: v.pipe(v.string(), v.slug()),
});

export type IssueGsi1PkComponents = v.InferOutput<
	typeof issueGsi1PkComponentsSchema
>;

export function captureIssueGsi1PkComponents(
	message?: v.ErrorMessage<v.RawTransformIssue<string>> | undefined,
): v.RawTransformAction<string, IssueGsi1PkComponents> {
	return v.captureRegex(
		ISSUE_GSI1_PARTITION_KEY_REGEX,
		message ?? defaultMessage,
	) as v.RawTransformAction<string, IssueGsi1PkComponents>;
}
