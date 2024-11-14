import { SERIES_GSI2_CURSOR_REGEX } from '../regex';

import * as v from '../../core';

const defaultMessage: v.ErrorMessage<v.GenericIssue<string>> = (issue) =>
	`Invalid series gsi2 cursor: Received "${issue.input}"`;

export function seriesGsi2Cursor<TInput extends string>(): v.RegexAction<
	TInput,
	undefined
>;

export function seriesGsi2Cursor<
	TInput extends string,
	const TMessage extends v.ErrorMessage<v.RegexIssue<TInput>> | undefined,
>(message: TMessage): v.RegexAction<TInput, TMessage>;

export function seriesGsi2Cursor(
	message?: v.ErrorMessage<v.RegexIssue<string>>,
): v.RegexAction<string, v.ErrorMessage<v.RegexIssue<string>> | undefined> {
	return v.regex(SERIES_GSI2_CURSOR_REGEX, message ?? defaultMessage);
}

export const seriesGsi2CursorComponentsSchema = v.strictObject({
	id: v.pipe(v.string(), v.id()),
	slug: v.pipe(v.string(), v.slug()),
	publisherId: v.pipe(v.string(), v.id()),
});

export type SeriesGsi2CursorComponents = v.InferOutput<
	typeof seriesGsi2CursorComponentsSchema
>;

export function captureSeriesGsi2CursorComponents(
	message?: v.ErrorMessage<v.RawTransformIssue<string>> | undefined,
): v.RawTransformAction<string, SeriesGsi2CursorComponents> {
	return v.captureRegex(
		SERIES_GSI2_CURSOR_REGEX,
		message ?? defaultMessage,
	) as v.RawTransformAction<string, SeriesGsi2CursorComponents>;
}
