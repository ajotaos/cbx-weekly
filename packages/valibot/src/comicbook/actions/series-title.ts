import { SERIES_TITLE_REGEX } from '../regex';

import { publisherName } from './publisher-name';
import { seriesName } from './series-name';

import * as v from '../../core';

const defaultMessage: v.ErrorMessage<v.GenericIssue<string>> = (issue) =>
	`Invalid series title: Received "${issue.input}"`;

export function seriesTitle<TInput extends string>(): v.RegexAction<
	TInput,
	undefined
>;

export function seriesTitle<
	TInput extends string,
	const TMessage extends v.ErrorMessage<v.RegexIssue<TInput>> | undefined,
>(message: TMessage): v.RegexAction<TInput, TMessage>;

export function seriesTitle(
	message?: v.ErrorMessage<v.RegexIssue<string>>,
): v.RegexAction<string, v.ErrorMessage<v.RegexIssue<string>> | undefined> {
	return v.regex(SERIES_TITLE_REGEX, message ?? defaultMessage);
}

export const seriesTitleComponentsSchema = v.strictObject({
	publisher: v.pipe(v.string(), publisherName()),
	name: v.pipe(v.string(), seriesName()),
});

export type SeriesTitleComponents = v.InferOutput<
	typeof seriesTitleComponentsSchema
>;

export function captureSeriesTitleComponents(
	message?: v.ErrorMessage<v.RawTransformIssue<string>> | undefined,
): v.RawTransformAction<string, SeriesTitleComponents> {
	return v.captureRegex(
		SERIES_TITLE_REGEX,
		message ?? defaultMessage,
	) as v.RawTransformAction<string, SeriesTitleComponents>;
}
