import { SERIES_PARTITION_KEY_REGEX } from '../regex';

import * as v from '../../core';

const defaultMessage: v.ErrorMessage<v.GenericIssue<string>> = (issue) =>
	`Invalid series pk: Received "${issue.input}"`;

export function seriesPk<TInput extends string>(): v.RegexAction<
	TInput,
	undefined
>;

export function seriesPk<
	TInput extends string,
	const TMessage extends v.ErrorMessage<v.RegexIssue<TInput>> | undefined,
>(message: TMessage): v.RegexAction<TInput, TMessage>;

export function seriesPk(
	message?: v.ErrorMessage<v.RegexIssue<string>>,
): v.RegexAction<string, v.ErrorMessage<v.RegexIssue<string>> | undefined> {
	return v.regex(SERIES_PARTITION_KEY_REGEX, message ?? defaultMessage);
}

export const seriesPkComponentsSchema = v.strictObject({
	id: v.pipe(v.string(), v.id()),
});

export type SeriesPkComponents = v.InferOutput<typeof seriesPkComponentsSchema>;

export function captureSeriesPkComponents(
	message?: v.ErrorMessage<v.RawTransformIssue<string>> | undefined,
): v.RawTransformAction<string, SeriesPkComponents> {
	return v.captureRegex(
		SERIES_PARTITION_KEY_REGEX,
		message ?? defaultMessage,
	) as v.RawTransformAction<string, SeriesPkComponents>;
}
