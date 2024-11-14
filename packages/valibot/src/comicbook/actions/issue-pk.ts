import { ISSUE_PARTITION_KEY_REGEX } from '../regex';

import * as v from '../../core';

const defaultMessage: v.ErrorMessage<v.GenericIssue<string>> = (issue) =>
	`Invalid issue pk: Received "${issue.input}"`;

export function issuePk<TInput extends string>(): v.RegexAction<
	TInput,
	undefined
>;

export function issuePk<
	TInput extends string,
	const TMessage extends v.ErrorMessage<v.RegexIssue<TInput>> | undefined,
>(message: TMessage): v.RegexAction<TInput, TMessage>;

export function issuePk(
	message?: v.ErrorMessage<v.RegexIssue<string>>,
): v.RegexAction<string, v.ErrorMessage<v.RegexIssue<string>> | undefined> {
	return v.regex(ISSUE_PARTITION_KEY_REGEX, message ?? defaultMessage);
}

export const issuePkComponentsSchema = v.strictObject({
	id: v.pipe(v.string(), v.id()),
});

export type IssuePkComponents = v.InferOutput<typeof issuePkComponentsSchema>;

export function captureIssuePkComponents(
	message?: v.ErrorMessage<v.RawTransformIssue<string>> | undefined,
): v.RawTransformAction<string, IssuePkComponents> {
	return v.captureRegex(
		ISSUE_PARTITION_KEY_REGEX,
		message ?? defaultMessage,
	) as v.RawTransformAction<string, IssuePkComponents>;
}
