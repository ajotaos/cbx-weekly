import { SERIES_UNIQUE_SLUG_SORT_KEY_REGEX } from '../regex';

import * as v from '../../core';

import type { EmptyObject } from 'type-fest';

const defaultMessage: v.ErrorMessage<v.GenericIssue<string>> = (issue) =>
	`Invalid series unique slug sk: Received "${issue.input}"`;

export function seriesUniqueSlugSk<TInput extends string>(): v.RegexAction<
	TInput,
	undefined
>;

export function seriesUniqueSlugSk<
	TInput extends string,
	const TMessage extends v.ErrorMessage<v.RegexIssue<TInput>> | undefined,
>(message: TMessage): v.RegexAction<TInput, TMessage>;

export function seriesUniqueSlugSk(
	message?: v.ErrorMessage<v.RegexIssue<string>>,
): v.RegexAction<string, v.ErrorMessage<v.RegexIssue<string>> | undefined> {
	return v.regex(SERIES_UNIQUE_SLUG_SORT_KEY_REGEX, message ?? defaultMessage);
}

export const seriesUniqueSlugSkComponentsSchema = v.strictObject({});

export type SeriesUniqueSlugSkComponents = EmptyObject;

export function captureSeriesUniqueSlugSkComponents(
	message?: v.ErrorMessage<v.RawTransformIssue<string>> | undefined,
): v.RawTransformAction<string, SeriesUniqueSlugSkComponents> {
	return v.captureRegex(
		SERIES_UNIQUE_SLUG_SORT_KEY_REGEX,
		message ?? defaultMessage,
	) as v.RawTransformAction<string, SeriesUniqueSlugSkComponents>;
}
