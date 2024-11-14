import { SERIES_GSI2_SORT_KEY_REGEX } from '../regex';

import * as v from '../../core';

const defaultMessage: v.ErrorMessage<v.GenericIssue<string>> = (issue) =>
	`Invalid series gsi2 sk: Received "${issue.input}"`;

export function seriesGsi2Sk<TInput extends string>(): v.RegexAction<
	TInput,
	undefined
>;

export function seriesGsi2Sk<
	TInput extends string,
	const TMessage extends v.ErrorMessage<v.RegexIssue<TInput>> | undefined,
>(message: TMessage): v.RegexAction<TInput, TMessage>;

export function seriesGsi2Sk(
	message?: v.ErrorMessage<v.RegexIssue<string>>,
): v.RegexAction<string, v.ErrorMessage<v.RegexIssue<string>> | undefined> {
	return v.regex(SERIES_GSI2_SORT_KEY_REGEX, message ?? defaultMessage);
}

export const seriesGsi2SkComponentsSchema = v.strictObject({
	slug: v.pipe(v.string(), v.slug()),
});

export type SeriesGsi2SkComponents = v.InferOutput<
	typeof seriesGsi2SkComponentsSchema
>;

export function captureSeriesGsi2SkComponents(
	message?: v.ErrorMessage<v.RawTransformIssue<string>> | undefined,
): v.RawTransformAction<string, SeriesGsi2SkComponents> {
	return v.captureRegex(
		SERIES_GSI2_SORT_KEY_REGEX,
		message ?? defaultMessage,
	) as v.RawTransformAction<string, SeriesGsi2SkComponents>;
}
