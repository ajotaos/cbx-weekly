import { PUBLISHER_PARTITION_KEY_REGEX } from '../regex';

import * as v from '../../core';

const defaultMessage: v.ErrorMessage<v.GenericIssue<string>> = (issue) =>
	`Invalid publisher pk: Received "${issue.input}"`;

export function publisherPk<TInput extends string>(): v.RegexAction<
	TInput,
	undefined
>;

export function publisherPk<
	TInput extends string,
	const TMessage extends v.ErrorMessage<v.RegexIssue<TInput>> | undefined,
>(message: TMessage): v.RegexAction<TInput, TMessage>;

export function publisherPk(
	message?: v.ErrorMessage<v.RegexIssue<string>>,
): v.RegexAction<string, v.ErrorMessage<v.RegexIssue<string>> | undefined> {
	return v.regex(PUBLISHER_PARTITION_KEY_REGEX, message ?? defaultMessage);
}

export const publisherPkComponentsSchema = v.strictObject({
	id: v.pipe(v.string(), v.id()),
});

export type PublisherPkComponents = v.InferOutput<
	typeof publisherPkComponentsSchema
>;

export function capturePublisherPkComponents(
	message?: v.ErrorMessage<v.RawTransformIssue<string>> | undefined,
): v.RawTransformAction<string, PublisherPkComponents> {
	return v.captureRegex(
		PUBLISHER_PARTITION_KEY_REGEX,
		message ?? defaultMessage,
	) as v.RawTransformAction<string, PublisherPkComponents>;
}
