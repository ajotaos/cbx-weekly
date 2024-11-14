import { SERIES_SORT_KEY_REGEX } from '../regex';

import * as v from '../../core';

import type { EmptyObject } from 'type-fest';

const defaultMessage: v.ErrorMessage<v.GenericIssue<string>> = (issue) =>
	`Invalid series sk: Received "${issue.input}"`;

export function seriesSk<TInput extends string>(): v.RegexAction<
	TInput,
	undefined
>;

export function seriesSk<
	TInput extends string,
	const TMessage extends v.ErrorMessage<v.RegexIssue<TInput>> | undefined,
>(message: TMessage): v.RegexAction<TInput, TMessage>;

export function seriesSk(
	message?: v.ErrorMessage<v.RegexIssue<string>>,
): v.RegexAction<string, v.ErrorMessage<v.RegexIssue<string>> | undefined> {
	return v.regex(SERIES_SORT_KEY_REGEX, message ?? defaultMessage);
}

export const seriesSkComponentsSchema = v.strictObject({});

export type SeriesSkComponents = EmptyObject;

export function captureSeriesSkComponents(
	message?: v.ErrorMessage<v.RawTransformIssue<string>> | undefined,
): v.RawTransformAction<string, SeriesSkComponents> {
	return v.captureRegex(
		SERIES_SORT_KEY_REGEX,
		message ?? defaultMessage,
	) as v.RawTransformAction<string, SeriesSkComponents>;
}
