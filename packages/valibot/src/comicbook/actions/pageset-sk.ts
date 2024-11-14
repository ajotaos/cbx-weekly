import { PAGESET_SORT_KEY_REGEX } from '../regex';

import * as v from '../../core';

import type { EmptyObject } from 'type-fest';

const defaultMessage: v.ErrorMessage<v.GenericIssue<string>> = (issue) =>
	`Invalid pageset sk: Received "${issue.input}"`;

export function pagesetSk<TInput extends string>(): v.RegexAction<
	TInput,
	undefined
>;

export function pagesetSk<
	TInput extends string,
	const TMessage extends v.ErrorMessage<v.RegexIssue<TInput>> | undefined,
>(message: TMessage): v.RegexAction<TInput, TMessage>;

export function pagesetSk(
	message?: v.ErrorMessage<v.RegexIssue<string>>,
): v.RegexAction<string, v.ErrorMessage<v.RegexIssue<string>> | undefined> {
	return v.regex(PAGESET_SORT_KEY_REGEX, message ?? defaultMessage);
}

export const pagesetSkComponentsSchema = v.strictObject({});

export type PagesetSkComponents = EmptyObject;

export function capturePagesetSkComponents(
	message?: v.ErrorMessage<v.RawTransformIssue<string>> | undefined,
): v.RawTransformAction<string, PagesetSkComponents> {
	return v.captureRegex(
		PAGESET_SORT_KEY_REGEX,
		message ?? defaultMessage,
	) as v.RawTransformAction<string, PagesetSkComponents>;
}
