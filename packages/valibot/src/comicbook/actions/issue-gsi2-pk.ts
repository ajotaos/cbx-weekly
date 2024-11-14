import { ISSUE_GSI2_PARTITION_KEY_REGEX } from '../regex';

import * as v from '../../core';

const defaultMessage: v.ErrorMessage<v.GenericIssue<string>> = (issue) =>
	`Invalid issue gsi2 pk: Received "${issue.input}"`;

export function issueGsi2Pk<TInput extends string>(): v.RegexAction<
	TInput,
	undefined
>;

export function issueGsi2Pk<
	TInput extends string,
	const TMessage extends v.ErrorMessage<v.RegexIssue<TInput>> | undefined,
>(message: TMessage): v.RegexAction<TInput, TMessage>;

export function issueGsi2Pk(
	message?: v.ErrorMessage<v.RegexIssue<string>>,
): v.RegexAction<string, v.ErrorMessage<v.RegexIssue<string>> | undefined> {
	return v.regex(ISSUE_GSI2_PARTITION_KEY_REGEX, message ?? defaultMessage);
}

export const issueGsi2PkComponentsSchema = v.strictObject({
	seriesId: v.pipe(v.string(), v.id()),
});

export type IssueGsi2PkComponents = v.InferOutput<
	typeof issueGsi2PkComponentsSchema
>;

export function captureIssueGsi2PkComponents(
	message?: v.ErrorMessage<v.RawTransformIssue<string>> | undefined,
): v.RawTransformAction<string, IssueGsi2PkComponents> {
	return v.captureRegex(
		ISSUE_GSI2_PARTITION_KEY_REGEX,
		message ?? defaultMessage,
	) as v.RawTransformAction<string, IssueGsi2PkComponents>;
}
