import { PAGESET_PAGE_NUMBER_REGEX } from '../regex';

import * as v from '../../core';

const defaultMessage: v.ErrorMessage<v.GenericIssue<string>> = (issue) =>
	`Invalid pageset page number: Received "${issue.input}"`;

export function pagesetPageNumber<TInput extends string>(): v.RegexAction<
	TInput,
	undefined
>;

export function pagesetPageNumber<
	TInput extends string,
	const TMessage extends v.ErrorMessage<v.RegexIssue<TInput>> | undefined,
>(message: TMessage): v.RegexAction<TInput, TMessage>;

export function pagesetPageNumber(
	message?: v.ErrorMessage<v.RegexIssue<string>>,
): v.RegexAction<string, v.ErrorMessage<v.RegexIssue<string>> | undefined> {
	return v.regex(PAGESET_PAGE_NUMBER_REGEX, message ?? defaultMessage);
}
