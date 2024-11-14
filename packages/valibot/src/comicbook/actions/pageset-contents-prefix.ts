import { PAGESET_CONTENTS_PREFIX_REGEX } from '../regex';

import * as v from '../../core';

const defaultMessage: v.ErrorMessage<v.GenericIssue<string>> = (issue) =>
	`Invalid pageset contents prefix: Received "${issue.input}"`;

export function pagesetContentsPrefix<TInput extends string>(): v.RegexAction<
	TInput,
	undefined
>;

export function pagesetContentsPrefix<
	TInput extends string,
	const TMessage extends v.ErrorMessage<v.RegexIssue<TInput>> | undefined,
>(message: TMessage): v.RegexAction<TInput, TMessage>;

export function pagesetContentsPrefix(
	message?: v.ErrorMessage<v.RegexIssue<string>>,
): v.RegexAction<string, v.ErrorMessage<v.RegexIssue<string>> | undefined> {
	return v.regex(PAGESET_CONTENTS_PREFIX_REGEX, message ?? defaultMessage);
}

export const pagesetContentsPrefixComponentsSchema = v.strictObject({
	pagesetId: v.pipe(v.string(), v.id()),
});

export type PagesetContentsPrefixComponents = v.InferOutput<
	typeof pagesetContentsPrefixComponentsSchema
>;

export function capturePagesetContentsPrefixComponents(
	message?: v.ErrorMessage<v.RawTransformIssue<string>> | undefined,
): v.RawTransformAction<string, PagesetContentsPrefixComponents> {
	return v.captureRegex(
		PAGESET_CONTENTS_PREFIX_REGEX,
		message ?? defaultMessage,
	) as v.RawTransformAction<string, PagesetContentsPrefixComponents>;
}
