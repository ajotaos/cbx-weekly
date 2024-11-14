import { SERIES_GSI1_SORT_KEY_REGEX } from '../regex';

import * as v from '../../core';

import type { EmptyObject } from 'type-fest';

const defaultMessage: v.ErrorMessage<v.GenericIssue<string>> = (issue) =>
	`Invalid series gsi1 sk: Received "${issue.input}"`;

export function seriesGsi1Sk<TInput extends string>(): v.RegexAction<
	TInput,
	undefined
>;

export function seriesGsi1Sk<
	TInput extends string,
	const TMessage extends v.ErrorMessage<v.RegexIssue<TInput>> | undefined,
>(message: TMessage): v.RegexAction<TInput, TMessage>;

export function seriesGsi1Sk(
	message?: v.ErrorMessage<v.RegexIssue<string>>,
): v.RegexAction<string, v.ErrorMessage<v.RegexIssue<string>> | undefined> {
	return v.regex(SERIES_GSI1_SORT_KEY_REGEX, message ?? defaultMessage);
}

export const seriesGsi1SkComponentsSchema = v.strictObject({});

export type SeriesGsi1SkComponents = EmptyObject;

export function captureSeriesGsi1SkComponents(
	message?: v.ErrorMessage<v.RawTransformIssue<string>> | undefined,
): v.RawTransformAction<string, SeriesGsi1SkComponents> {
	return v.captureRegex(
		SERIES_GSI1_SORT_KEY_REGEX,
		message ?? defaultMessage,
	) as v.RawTransformAction<string, SeriesGsi1SkComponents>;
}
