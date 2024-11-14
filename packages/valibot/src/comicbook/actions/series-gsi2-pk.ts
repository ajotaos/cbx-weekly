import { SERIES_GSI2_PARTITION_KEY_REGEX } from '../regex';

import * as v from '../../core';

const defaultMessage: v.ErrorMessage<v.GenericIssue<string>> = (issue) =>
	`Invalid series gsi2 pk: Received "${issue.input}"`;

export function seriesGsi2Pk<TInput extends string>(): v.RegexAction<
	TInput,
	undefined
>;

export function seriesGsi2Pk<
	TInput extends string,
	const TMessage extends v.ErrorMessage<v.RegexIssue<TInput>> | undefined,
>(message: TMessage): v.RegexAction<TInput, TMessage>;

export function seriesGsi2Pk(
	message?: v.ErrorMessage<v.RegexIssue<string>>,
): v.RegexAction<string, v.ErrorMessage<v.RegexIssue<string>> | undefined> {
	return v.regex(SERIES_GSI2_PARTITION_KEY_REGEX, message ?? defaultMessage);
}

export const seriesGsi2PkComponentsSchema = v.strictObject({
	publisherId: v.pipe(v.string(), v.id()),
});

export type SeriesGsi2PkComponents = v.InferOutput<
	typeof seriesGsi2PkComponentsSchema
>;

export function captureSeriesGsi2PkComponents(
	message?: v.ErrorMessage<v.RawTransformIssue<string>> | undefined,
): v.RawTransformAction<string, SeriesGsi2PkComponents> {
	return v.captureRegex(
		SERIES_GSI2_PARTITION_KEY_REGEX,
		message ?? defaultMessage,
	) as v.RawTransformAction<string, SeriesGsi2PkComponents>;
}
