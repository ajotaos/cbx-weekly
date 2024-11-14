import { PUBLISHER_GSI2_SORT_KEY_REGEX } from '../regex';

import * as v from '../../core';

const defaultMessage: v.ErrorMessage<v.GenericIssue<string>> = (issue) =>
	`Invalid publisher gsi2 sk: Received "${issue.input}"`;

export function publisherGsi2Sk<TInput extends string>(): v.RegexAction<
	TInput,
	undefined
>;

export function publisherGsi2Sk<
	TInput extends string,
	const TMessage extends v.ErrorMessage<v.RegexIssue<TInput>> | undefined,
>(message: TMessage): v.RegexAction<TInput, TMessage>;

export function publisherGsi2Sk(
	message?: v.ErrorMessage<v.RegexIssue<string>>,
): v.RegexAction<string, v.ErrorMessage<v.RegexIssue<string>> | undefined> {
	return v.regex(PUBLISHER_GSI2_SORT_KEY_REGEX, message ?? defaultMessage);
}

export const publisherGsi2SkComponentsSchema = v.strictObject({
	slug: v.pipe(v.string(), v.slug()),
});

export type PublisherGsi2SkComponents = v.InferOutput<
	typeof publisherGsi2SkComponentsSchema
>;

export function capturePublisherGsi2SkComponents(
	message?: v.ErrorMessage<v.RawTransformIssue<string>> | undefined,
): v.RawTransformAction<string, PublisherGsi2SkComponents> {
	return v.captureRegex(
		PUBLISHER_GSI2_SORT_KEY_REGEX,
		message ?? defaultMessage,
	) as v.RawTransformAction<string, PublisherGsi2SkComponents>;
}
