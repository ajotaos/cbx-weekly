import { SERIES_GSI1_PARTITION_KEY_REGEX } from '../regex';

import * as v from '../../core';

const defaultMessage: v.ErrorMessage<v.GenericIssue<string>> = (issue) =>
	`Invalid series gsi1 pk: Received "${issue.input}"`;

export function seriesGsi1Pk<TInput extends string>(): v.RegexAction<
	TInput,
	undefined
>;

export function seriesGsi1Pk<
	TInput extends string,
	const TMessage extends v.ErrorMessage<v.RegexIssue<TInput>> | undefined,
>(message: TMessage): v.RegexAction<TInput, TMessage>;

export function seriesGsi1Pk(
	message?: v.ErrorMessage<v.RegexIssue<string>>,
): v.RegexAction<string, v.ErrorMessage<v.RegexIssue<string>> | undefined> {
	return v.regex(SERIES_GSI1_PARTITION_KEY_REGEX, message ?? defaultMessage);
}

export const seriesGsi1PkComponentsSchema = v.strictObject({
	slug: v.pipe(v.string(), v.slug()),
});

export type SeriesGsi1PkComponents = v.InferOutput<
	typeof seriesGsi1PkComponentsSchema
>;

export function captureSeriesGsi1PkComponents(
	message?: v.ErrorMessage<v.RawTransformIssue<string>> | undefined,
): v.RawTransformAction<string, SeriesGsi1PkComponents> {
	return v.captureRegex(
		SERIES_GSI1_PARTITION_KEY_REGEX,
		message ?? defaultMessage,
	) as v.RawTransformAction<string, SeriesGsi1PkComponents>;
}
