import { ID_REGEX } from '../regex';

import { regex } from 'valibot';

import type { ErrorMessage, RegexAction, RegexIssue } from 'valibot';

export function id<TInput extends string>(): RegexAction<TInput, undefined>;

export function id<
	TInput extends string,
	const TMessage extends ErrorMessage<RegexIssue<TInput>> | undefined,
>(message: TMessage): RegexAction<TInput, TMessage>;

export function id(
	message?: ErrorMessage<RegexIssue<string>>,
): RegexAction<string, ErrorMessage<RegexIssue<string>> | undefined> {
	return regex(
		ID_REGEX,
		message ?? ((issue) => `Invalid ID: Received "${issue.input}"`),
	);
}
