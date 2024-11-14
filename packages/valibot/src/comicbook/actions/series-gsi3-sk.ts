import { SERIES_GSI3_SORT_KEY_REGEX } from '../regex';

import * as v from '../../core';

const defaultMessage: v.ErrorMessage<v.GenericIssue<string>> = (issue) =>
	`Invalid series gsi3 sk: Received "${issue.input}"`;

export function seriesGsi3Sk<TInput extends string>(): v.RegexAction<
	TInput,
	undefined
>;

export function seriesGsi3Sk<
	TInput extends string,
	const TMessage extends v.ErrorMessage<v.RegexIssue<TInput>> | undefined,
>(message: TMessage): v.RegexAction<TInput, TMessage>;

export function seriesGsi3Sk(
	message?: v.ErrorMessage<v.RegexIssue<string>>,
): v.RegexAction<string, v.ErrorMessage<v.RegexIssue<string>> | undefined> {
	return v.regex(SERIES_GSI3_SORT_KEY_REGEX, message ?? defaultMessage);
}

export const seriesGsi3SkComponentsSchema = v.strictObject({
	slug: v.pipe(v.string(), v.slug()),
	releaseWeekday: v.pipe(v.string(), v.isoWeekday()),
});

export type SeriesGsi3SkComponents = v.InferOutput<
	typeof seriesGsi3SkComponentsSchema
>;

export function captureSeriesGsi3SkComponents(
	message?: v.ErrorMessage<v.RawTransformIssue<string>> | undefined,
): v.RawTransformAction<string, SeriesGsi3SkComponents> {
	return v.captureRegex(
		SERIES_GSI3_SORT_KEY_REGEX,
		message ?? defaultMessage,
	) as v.RawTransformAction<string, SeriesGsi3SkComponents>;
}
