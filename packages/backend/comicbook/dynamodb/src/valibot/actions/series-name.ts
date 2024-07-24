import { SERIES_TABLE_ITEM_NAME_REGEX } from '../regex';

import * as v from '@cbx-weekly/backend-core-valibot';

export function seriesName<TInput extends string>(): v.RegexAction<
	TInput,
	undefined
>;

export function seriesName<
	TInput extends string,
	const TMessage extends v.ErrorMessage<v.RegexIssue<TInput>> | undefined,
>(message: TMessage): v.RegexAction<TInput, TMessage>;

export function seriesName(
	message?: v.ErrorMessage<v.RegexIssue<string>>,
): v.RegexAction<string, v.ErrorMessage<v.RegexIssue<string>> | undefined> {
	return v.regex(
		SERIES_TABLE_ITEM_NAME_REGEX,
		message ?? ((issue) => `Invalid series name: Received "${issue.input}"`),
	);
}
