import { SERIES_UNIQUE_SLUG_TABLE_ITEM_SORT_KEY_REGEX } from '../regex';

import * as v from '@cbx-weekly/backend-core-valibot';

export function seriesUniqueSlugSortKey<TInput extends string>(): v.RegexAction<
	TInput,
	undefined
>;

export function seriesUniqueSlugSortKey<
	TInput extends string,
	const TMessage extends v.ErrorMessage<v.RegexIssue<TInput>> | undefined,
>(message: TMessage): v.RegexAction<TInput, TMessage>;

export function seriesUniqueSlugSortKey(
	message?: v.ErrorMessage<v.RegexIssue<string>>,
): v.RegexAction<string, v.ErrorMessage<v.RegexIssue<string>> | undefined> {
	return v.regex(
		SERIES_UNIQUE_SLUG_TABLE_ITEM_SORT_KEY_REGEX,
		message ??
			((issue) => `Invalid series sort key: Received "${issue.input}"`),
	);
}

export function captureSeriesUniqueSlugSortKey(
	message?: v.ErrorMessage<v.RawTransformIssue<string>> | undefined,
) {
	return v.pipe(
		v.string(),
		v.captureRegex(
			SERIES_UNIQUE_SLUG_TABLE_ITEM_SORT_KEY_REGEX,
			message ??
				((issue) => `Invalid series sort key: Received "${issue.input}"`),
		),
		v.strictObject({}),
	);
}
