import { ISO_WEEK_DATE_REGEX } from '../regex';

import * as v from 'valibot';

export function isoWeekDate<TInput extends string>(): v.RegexAction<
	TInput,
	undefined
>;

export function isoWeekDate<
	TInput extends string,
	const TMessage extends v.ErrorMessage<v.RegexIssue<TInput>> | undefined,
>(message: TMessage): v.RegexAction<TInput, TMessage>;

export function isoWeekDate(
	message?: v.ErrorMessage<v.RegexIssue<string>>,
): v.RegexAction<string, v.ErrorMessage<v.RegexIssue<string>> | undefined> {
	return v.regex(
		ISO_WEEK_DATE_REGEX,
		message ?? ((issue) => `Invalid week date: Received "${issue.input}"`),
	);
}
