import { PAGESET_PAGE_KEY_REGEX } from '../regex';

import { pagesetPageNumber } from './pageset-page-number';

import * as v from '../../core';

const defaultMessage: v.ErrorMessage<v.GenericIssue<string>> = (issue) =>
	`Invalid pageset page key: Received "${issue.input}"`;

export function pagesetPageKey<TInput extends string>(): v.RegexAction<
	TInput,
	undefined
>;

export function pagesetPageKey<
	TInput extends string,
	const TMessage extends v.ErrorMessage<v.RegexIssue<TInput>> | undefined,
>(message: TMessage): v.RegexAction<TInput, TMessage>;

export function pagesetPageKey(
	message?: v.ErrorMessage<v.RegexIssue<string>>,
): v.RegexAction<string, v.ErrorMessage<v.RegexIssue<string>> | undefined> {
	return v.regex(PAGESET_PAGE_KEY_REGEX, message ?? defaultMessage);
}

export const pagesetPageKeyComponentsSchema = v.strictObject({
	number: v.pipe(v.string(), pagesetPageNumber()),
	pagesetId: v.pipe(v.string(), v.id()),
});

export type PagesetPageKeyComponents = v.InferOutput<
	typeof pagesetPageKeyComponentsSchema
>;

export function capturePagesetPageKeyComponents(
	message?: v.ErrorMessage<v.RawTransformIssue<string>> | undefined,
): v.RawTransformAction<string, PagesetPageKeyComponents> {
	return v.captureRegex(
		PAGESET_PAGE_KEY_REGEX,
		message ?? defaultMessage,
	) as v.RawTransformAction<string, PagesetPageKeyComponents>;
}
