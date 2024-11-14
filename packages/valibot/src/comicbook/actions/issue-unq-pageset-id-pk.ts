import { ISSUE_UNIQUE_PAGESET_ID_PARTITION_KEY_REGEX } from '../regex';

import * as v from '../../core';

const defaultMessage: v.ErrorMessage<v.GenericIssue<string>> = (issue) =>
	`Invalid issue unique pageset id pk: Received "${issue.input}"`;

export function issueUniquePagesetIdPk<TInput extends string>(): v.RegexAction<
	TInput,
	undefined
>;

export function issueUniquePagesetIdPk<
	TInput extends string,
	const TMessage extends v.ErrorMessage<v.RegexIssue<TInput>> | undefined,
>(message: TMessage): v.RegexAction<TInput, TMessage>;

export function issueUniquePagesetIdPk(
	message?: v.ErrorMessage<v.RegexIssue<string>>,
): v.RegexAction<string, v.ErrorMessage<v.RegexIssue<string>> | undefined> {
	return v.regex(
		ISSUE_UNIQUE_PAGESET_ID_PARTITION_KEY_REGEX,
		message ?? defaultMessage,
	);
}

export const issueUniquePagesetIdPkComponentsSchema = v.strictObject({
	pagesetId: v.pipe(v.string(), v.id()),
});

export type IssueUniquePagesetIdPkComponents = v.InferOutput<
	typeof issueUniquePagesetIdPkComponentsSchema
>;

export function captureIssueUniquePagesetIdPkComponents(
	message?: v.ErrorMessage<v.RawTransformIssue<string>> | undefined,
): v.RawTransformAction<string, IssueUniquePagesetIdPkComponents> {
	return v.captureRegex(
		ISSUE_UNIQUE_PAGESET_ID_PARTITION_KEY_REGEX,
		message ?? defaultMessage,
	) as v.RawTransformAction<string, IssueUniquePagesetIdPkComponents>;
}
