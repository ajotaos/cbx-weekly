import { PAGESET_PARTITION_KEY_REGEX } from '../regex';

import * as v from '../../core';

const defaultMessage: v.ErrorMessage<v.GenericIssue<string>> = (issue) =>
	`Invalid pageset pk: Received "${issue.input}"`;

export function pagesetPk<TInput extends string>(): v.RegexAction<
	TInput,
	undefined
>;

export function pagesetPk<
	TInput extends string,
	const TMessage extends v.ErrorMessage<v.RegexIssue<TInput>> | undefined,
>(message: TMessage): v.RegexAction<TInput, TMessage>;

export function pagesetPk(
	message?: v.ErrorMessage<v.RegexIssue<string>>,
): v.RegexAction<string, v.ErrorMessage<v.RegexIssue<string>> | undefined> {
	return v.regex(PAGESET_PARTITION_KEY_REGEX, message ?? defaultMessage);
}

export const pagesetPkComponentsSchema = v.strictObject({
	id: v.pipe(v.string(), v.id()),
});

export type PagesetPkComponents = v.InferOutput<
	typeof pagesetPkComponentsSchema
>;

export function capturePagesetPkComponents(
	message?: v.ErrorMessage<v.RawTransformIssue<string>> | undefined,
): v.RawTransformAction<string, PagesetPkComponents> {
	return v.captureRegex(
		PAGESET_PARTITION_KEY_REGEX,
		message ?? defaultMessage,
	) as v.RawTransformAction<string, PagesetPkComponents>;
}
