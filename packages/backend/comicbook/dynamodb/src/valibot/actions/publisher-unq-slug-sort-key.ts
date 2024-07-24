import { PUBLISHER_UNIQUE_SLUG_TABLE_ITEM_SORT_KEY_REGEX } from '../regex';

import * as v from '@cbx-weekly/backend-core-valibot';

export function publisherUniqueSlugSortKey<
	TInput extends string,
>(): v.RegexAction<TInput, undefined>;

export function publisherUniqueSlugSortKey<
	TInput extends string,
	const TMessage extends v.ErrorMessage<v.RegexIssue<TInput>> | undefined,
>(message: TMessage): v.RegexAction<TInput, TMessage>;

export function publisherUniqueSlugSortKey(
	message?: v.ErrorMessage<v.RegexIssue<string>>,
): v.RegexAction<string, v.ErrorMessage<v.RegexIssue<string>> | undefined> {
	return v.regex(
		PUBLISHER_UNIQUE_SLUG_TABLE_ITEM_SORT_KEY_REGEX,
		message ??
			((issue) => `Invalid publisher sort key: Received "${issue.input}"`),
	);
}

export function capturePublisherUniqueSlugSortKey(
	message?: v.ErrorMessage<v.RawTransformIssue<string>> | undefined,
) {
	return v.pipe(
		v.string(),
		v.captureRegex(
			PUBLISHER_UNIQUE_SLUG_TABLE_ITEM_SORT_KEY_REGEX,
			message ??
				((issue) => `Invalid publisher sort key: Received "${issue.input}"`),
		),
		v.strictObject({}),
	);
}
