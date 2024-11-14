import { SERIES_UNIQUE_SLUG_PARTITION_KEY_REGEX } from '../regex';

import * as v from '../../core';

const defaultMessage: v.ErrorMessage<v.GenericIssue<string>> = (issue) =>
	`Invalid series unique slug pk: Received "${issue.input}"`;

export function seriesUniqueSlugPk<TInput extends string>(): v.RegexAction<
	TInput,
	undefined
>;

export function seriesUniqueSlugPk<
	TInput extends string,
	const TMessage extends v.ErrorMessage<v.RegexIssue<TInput>> | undefined,
>(message: TMessage): v.RegexAction<TInput, TMessage>;

export function seriesUniqueSlugPk(
	message?: v.ErrorMessage<v.RegexIssue<string>>,
): v.RegexAction<string, v.ErrorMessage<v.RegexIssue<string>> | undefined> {
	return v.regex(
		SERIES_UNIQUE_SLUG_PARTITION_KEY_REGEX,
		message ?? defaultMessage,
	);
}

export const seriesUniqueSlugPkComponentsSchema = v.strictObject({
	slug: v.pipe(v.string(), v.slug()),
});

export type SeriesUniqueSlugPkComponents = v.InferOutput<
	typeof seriesUniqueSlugPkComponentsSchema
>;

export function captureSeriesUniqueSlugPkComponents(
	message?: v.ErrorMessage<v.RawTransformIssue<string>> | undefined,
): v.RawTransformAction<string, SeriesUniqueSlugPkComponents> {
	return v.captureRegex(
		SERIES_UNIQUE_SLUG_PARTITION_KEY_REGEX,
		message ?? defaultMessage,
	) as v.RawTransformAction<string, SeriesUniqueSlugPkComponents>;
}
