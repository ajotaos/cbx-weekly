import { ISO_WEEK_DAY_REGEX } from '../regex';

import * as v from 'valibot';

export function isoWeekday<TInput extends string>(): v.RegexAction<
	TInput,
	undefined
>;

export function isoWeekday<
	TInput extends string,
	const TMessage extends v.ErrorMessage<v.RegexIssue<TInput>> | undefined,
>(message: TMessage): v.RegexAction<TInput, TMessage>;

export function isoWeekday(
	message?: v.ErrorMessage<v.RegexIssue<string>>,
): v.RegexAction<string, v.ErrorMessage<v.RegexIssue<string>> | undefined> {
	return v.regex(
		ISO_WEEK_DAY_REGEX,
		message ?? ((issue) => `Invalid week day: Received "${issue.input}"`),
	);
}
