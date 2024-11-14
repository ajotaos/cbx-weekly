import { PAGESET_GSI1_PARTITION_KEY_REGEX } from '../regex';

import * as v from '../../core';

const defaultMessage: v.ErrorMessage<v.GenericIssue<string>> = (issue) =>
	`Invalid pageset gsi1 pk: Received "${issue.input}"`;

export function pagesetGsi1Pk<TInput extends string>(): v.RegexAction<
	TInput,
	undefined
>;

export function pagesetGsi1Pk<
	TInput extends string,
	const TMessage extends v.ErrorMessage<v.RegexIssue<TInput>> | undefined,
>(message: TMessage): v.RegexAction<TInput, TMessage>;

export function pagesetGsi1Pk(
	message?: v.ErrorMessage<v.RegexIssue<string>>,
): v.RegexAction<string, v.ErrorMessage<v.RegexIssue<string>> | undefined> {
	return v.regex(PAGESET_GSI1_PARTITION_KEY_REGEX, message ?? defaultMessage);
}

export const pagesetGsi1PkComponentsSchema = v.strictObject({
	issueId: v.pipe(v.string(), v.id()),
});

export type PagesetGsi1PkComponents = v.InferOutput<
	typeof pagesetGsi1PkComponentsSchema
>;

export function capturePagesetGsi1PkComponents(
	message?: v.ErrorMessage<v.RawTransformIssue<string>> | undefined,
): v.RawTransformAction<string, PagesetGsi1PkComponents> {
	return v.captureRegex(
		PAGESET_GSI1_PARTITION_KEY_REGEX,
		message ?? defaultMessage,
	) as v.RawTransformAction<string, PagesetGsi1PkComponents>;
}
