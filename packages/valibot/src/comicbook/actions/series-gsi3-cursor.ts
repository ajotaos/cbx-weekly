import { SERIES_GSI3_CURSOR_REGEX } from '../regex';

import * as v from '../../core';

const defaultMessage: v.ErrorMessage<v.GenericIssue<string>> = (issue) =>
	`Invalid series gsi3 cursor: Received "${issue.input}"`;

export function seriesGsi3Cursor<TInput extends string>(): v.RegexAction<
	TInput,
	undefined
>;

export function seriesGsi3Cursor<
	TInput extends string,
	const TMessage extends v.ErrorMessage<v.RegexIssue<TInput>> | undefined,
>(message: TMessage): v.RegexAction<TInput, TMessage>;

export function seriesGsi3Cursor(
	message?: v.ErrorMessage<v.RegexIssue<string>>,
): v.RegexAction<string, v.ErrorMessage<v.RegexIssue<string>> | undefined> {
	return v.regex(SERIES_GSI3_CURSOR_REGEX, message ?? defaultMessage);
}

export const seriesGsi3CursorComponentsSchema = v.strictObject({
	id: v.pipe(v.string(), v.id()),
	slug: v.pipe(v.string(), v.slug()),
	releaseDate: v.pipe(v.string(), v.isoWeekDate()),
});

export type SeriesGsi3CursorComponents = v.InferOutput<
	typeof seriesGsi3CursorComponentsSchema
>;

export function captureSeriesGsi3CursorComponents(
	message?: v.ErrorMessage<v.RawTransformIssue<string>> | undefined,
): v.RawTransformAction<string, SeriesGsi3CursorComponents> {
	return v.captureRegex(
		SERIES_GSI3_CURSOR_REGEX,
		message ?? defaultMessage,
	) as v.RawTransformAction<string, SeriesGsi3CursorComponents>;
}
