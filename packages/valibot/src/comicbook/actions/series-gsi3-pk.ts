import { SERIES_GSI3_PARTITION_KEY_REGEX } from '../regex';

import * as v from '../../core';

const defaultMessage: v.ErrorMessage<v.GenericIssue<string>> = (issue) =>
	`Invalid series gsi3 pk: Received "${issue.input}"`;

export function seriesGsi3Pk<TInput extends string>(): v.RegexAction<
	TInput,
	undefined
>;

export function seriesGsi3Pk<
	TInput extends string,
	const TMessage extends v.ErrorMessage<v.RegexIssue<TInput>> | undefined,
>(message: TMessage): v.RegexAction<TInput, TMessage>;

export function seriesGsi3Pk(
	message?: v.ErrorMessage<v.RegexIssue<string>>,
): v.RegexAction<string, v.ErrorMessage<v.RegexIssue<string>> | undefined> {
	return v.regex(SERIES_GSI3_PARTITION_KEY_REGEX, message ?? defaultMessage);
}

export const seriesGsi3PkComponentsSchema = v.strictObject({
	releaseWeek: v.pipe(v.string(), v.isoWeek()),
});

export type SeriesGsi3PkComponents = v.InferOutput<
	typeof seriesGsi3PkComponentsSchema
>;

export function captureSeriesGsi3PkComponents(
	message?: v.ErrorMessage<v.RawTransformIssue<string>> | undefined,
): v.RawTransformAction<string, SeriesGsi3PkComponents> {
	return v.captureRegex(
		SERIES_GSI3_PARTITION_KEY_REGEX,
		message ?? defaultMessage,
	) as v.RawTransformAction<string, SeriesGsi3PkComponents>;
}
