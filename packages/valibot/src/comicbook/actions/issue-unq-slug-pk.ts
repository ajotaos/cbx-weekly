import { ISSUE_UNIQUE_SLUG_PARTITION_KEY_REGEX } from '../regex';

import * as v from '../../core';

const defaultMessage: v.ErrorMessage<v.GenericIssue<string>> = (issue) =>
	`Invalid issue unique slug pk: Received "${issue.input}"`;

export function issueUniqueSlugPk<TInput extends string>(): v.RegexAction<
	TInput,
	undefined
>;

export function issueUniqueSlugPk<
	TInput extends string,
	const TMessage extends v.ErrorMessage<v.RegexIssue<TInput>> | undefined,
>(message: TMessage): v.RegexAction<TInput, TMessage>;

export function issueUniqueSlugPk(
	message?: v.ErrorMessage<v.RegexIssue<string>>,
): v.RegexAction<string, v.ErrorMessage<v.RegexIssue<string>> | undefined> {
	return v.regex(
		ISSUE_UNIQUE_SLUG_PARTITION_KEY_REGEX,
		message ?? defaultMessage,
	);
}

export const issueUniqueSlugPkComponentsSchema = v.strictObject({
	slug: v.pipe(v.string(), v.slug()),
});

export type IssueUniqueSlugPkComponents = v.InferOutput<
	typeof issueUniqueSlugPkComponentsSchema
>;

export function captureIssueUniqueSlugPkComponents(
	message?: v.ErrorMessage<v.RawTransformIssue<string>> | undefined,
): v.RawTransformAction<string, IssueUniqueSlugPkComponents> {
	return v.captureRegex(
		ISSUE_UNIQUE_SLUG_PARTITION_KEY_REGEX,
		message ?? defaultMessage,
	) as v.RawTransformAction<string, IssueUniqueSlugPkComponents>;
}
