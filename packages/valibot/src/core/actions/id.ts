import { ID_REGEX } from '../regex';

import * as v from 'valibot';

export function id<TInput extends string>(): v.RegexAction<TInput, undefined>;

export function id<
	TInput extends string,
	const TMessage extends v.ErrorMessage<v.RegexIssue<TInput>> | undefined,
>(message: TMessage): v.RegexAction<TInput, TMessage>;

export function id(
	message?: v.ErrorMessage<v.RegexIssue<string>>,
): v.RegexAction<string, v.ErrorMessage<v.RegexIssue<string>> | undefined> {
	return v.regex(
		ID_REGEX,
		message ?? ((issue) => `Invalid ID: Received "${issue.input}"`),
	);
}
