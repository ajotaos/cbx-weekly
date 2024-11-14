import { PUBLISHER_GSI1_PARTITION_KEY_REGEX } from '../regex';

import * as v from '../../core';

const defaultMessage: v.ErrorMessage<v.GenericIssue<string>> = (issue) =>
	`Invalid publisher gsi1 pk: Received "${issue.input}"`;

export function publisherGsi1Pk<TInput extends string>(): v.RegexAction<
	TInput,
	undefined
>;

export function publisherGsi1Pk<
	TInput extends string,
	const TMessage extends v.ErrorMessage<v.RegexIssue<TInput>> | undefined,
>(message: TMessage): v.RegexAction<TInput, TMessage>;

export function publisherGsi1Pk(
	message?: v.ErrorMessage<v.RegexIssue<string>>,
): v.RegexAction<string, v.ErrorMessage<v.RegexIssue<string>> | undefined> {
	return v.regex(PUBLISHER_GSI1_PARTITION_KEY_REGEX, message ?? defaultMessage);
}

export const publisherGsi1PkComponentsSchema = v.strictObject({
	slug: v.pipe(v.string(), v.slug()),
});

export type PublisherGsi1PkComponents = v.InferOutput<
	typeof publisherGsi1PkComponentsSchema
>;

export function capturePublisherGsi1PkComponents(
	message?: v.ErrorMessage<v.RawTransformIssue<string>> | undefined,
): v.RawTransformAction<string, PublisherGsi1PkComponents> {
	return v.captureRegex(
		PUBLISHER_GSI1_PARTITION_KEY_REGEX,
		message ?? defaultMessage,
	) as v.RawTransformAction<string, PublisherGsi1PkComponents>;
}
