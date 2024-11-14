import { PAGESET_GSI1_SORT_KEY_REGEX } from '../regex';

import * as v from '../../core';

const defaultMessage: v.ErrorMessage<v.GenericIssue<string>> = (issue) =>
	`Invalid pageset gsi1 sk: Received "${issue.input}"`;

export function pagesetGsi1Sk<TInput extends string>(): v.RegexAction<
	TInput,
	undefined
>;

export function pagesetGsi1Sk<
	TInput extends string,
	const TMessage extends v.ErrorMessage<v.RegexIssue<TInput>> | undefined,
>(message: TMessage): v.RegexAction<TInput, TMessage>;

export function pagesetGsi1Sk(
	message?: v.ErrorMessage<v.RegexIssue<string>>,
): v.RegexAction<string, v.ErrorMessage<v.RegexIssue<string>> | undefined> {
	return v.regex(PAGESET_GSI1_SORT_KEY_REGEX, message ?? defaultMessage);
}

export const pagesetGsi1SkComponentsSchema = v.strictObject({
	created: v.pipe(v.string(), v.epoch()),
});

export type PagesetGsi1SkComponents = v.InferOutput<
	typeof pagesetGsi1SkComponentsSchema
>;

export function capturePagesetGsi1SkComponents(
	message?: v.ErrorMessage<v.RawTransformIssue<string>> | undefined,
): v.RawTransformAction<string, PagesetGsi1SkComponents> {
	return v.captureRegex(
		PAGESET_GSI1_SORT_KEY_REGEX,
		message ?? defaultMessage,
	) as v.RawTransformAction<string, PagesetGsi1SkComponents>;
}
