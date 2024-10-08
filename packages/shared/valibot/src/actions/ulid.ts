import { ULID_REGEX } from '../regex';

import * as v from 'valibot';

export function ulid<TInput extends string>(): v.RegexAction<TInput, undefined>;

export function ulid<
	TInput extends string,
	const TMessage extends v.ErrorMessage<v.RegexIssue<TInput>> | undefined,
>(message: TMessage): v.RegexAction<TInput, TMessage>;

export function ulid(
	message?: v.ErrorMessage<v.RegexIssue<string>>,
): v.RegexAction<string, v.ErrorMessage<v.RegexIssue<string>> | undefined> {
	return v.regex(
		ULID_REGEX,
		message ?? ((issue) => `Invalid ULID: Received "${issue.input}"`),
	);
}
