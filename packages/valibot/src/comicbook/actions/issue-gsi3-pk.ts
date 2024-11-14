import { ISSUE_GSI3_PARTITION_KEY_REGEX } from '../regex';

import * as v from '../../core';

const defaultMessage: v.ErrorMessage<v.GenericIssue<string>> = (issue) =>
	`Invalid issue gsi3 pk: Received "${issue.input}"`;

export function issueGsi3Pk<TInput extends string>(): v.RegexAction<
	TInput,
	undefined
>;

export function issueGsi3Pk<
	TInput extends string,
	const TMessage extends v.ErrorMessage<v.RegexIssue<TInput>> | undefined,
>(message: TMessage): v.RegexAction<TInput, TMessage>;

export function issueGsi3Pk(
	message?: v.ErrorMessage<v.RegexIssue<string>>,
): v.RegexAction<string, v.ErrorMessage<v.RegexIssue<string>> | undefined> {
	return v.regex(ISSUE_GSI3_PARTITION_KEY_REGEX, message ?? defaultMessage);
}

export const issueGsi3PkComponentsSchema = v.strictObject({
	releaseWeek: v.pipe(v.string(), v.isoWeek()),
});

export type IssueGsi3PkComponents = v.InferOutput<
	typeof issueGsi3PkComponentsSchema
>;

export function captureIssueGsi3PkComponents(
	message?: v.ErrorMessage<v.RawTransformIssue<string>> | undefined,
): v.RawTransformAction<string, IssueGsi3PkComponents> {
	return v.captureRegex(
		ISSUE_GSI3_PARTITION_KEY_REGEX,
		message ?? defaultMessage,
	) as v.RawTransformAction<string, IssueGsi3PkComponents>;
}
