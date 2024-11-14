import { EPOCH_REGEX } from '../regex';

import * as v from 'valibot';

export function epoch<TInput extends string>(): v.RegexAction<
	TInput,
	undefined
>;

export function epoch<
	TInput extends string,
	const TMessage extends v.ErrorMessage<v.RegexIssue<TInput>> | undefined,
>(message: TMessage): v.RegexAction<TInput, TMessage>;

export function epoch(
	message?: v.ErrorMessage<v.RegexIssue<string>>,
): v.RegexAction<string, v.ErrorMessage<v.RegexIssue<string>> | undefined> {
	return v.regex(
		EPOCH_REGEX,
		message ?? ((issue) => `Invalid epoch: Received "${issue.input}"`),
	);
}
