import { SLUG_REGEX } from '../regex';

import { regex } from 'valibot';

import type { ErrorMessage, RegexAction, RegexIssue } from 'valibot';

export function slug<TInput extends string>(): RegexAction<TInput, undefined>;

export function slug<
	TInput extends string,
	const TMessage extends ErrorMessage<RegexIssue<TInput>> | undefined,
>(message: TMessage): RegexAction<TInput, TMessage>;

export function slug(
	message?: ErrorMessage<RegexIssue<string>>,
): RegexAction<string, ErrorMessage<RegexIssue<string>> | undefined> {
	return regex(
		SLUG_REGEX,
		message ?? ((issue) => `Invalid slug: Received "${issue.input}"`),
	);
}
