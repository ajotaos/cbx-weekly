import { PUBLISHER_UNIQUE_SLUG_PARTITION_KEY_REGEX } from '../regex';

import * as v from '../../core';

const defaultMessage: v.ErrorMessage<v.GenericIssue<string>> = (issue) =>
	`Invalid publisher unique slug pk: Received "${issue.input}"`;

export function publisherUniqueSlugPk<TInput extends string>(): v.RegexAction<
	TInput,
	undefined
>;

export function publisherUniqueSlugPk<
	TInput extends string,
	const TMessage extends v.ErrorMessage<v.RegexIssue<TInput>> | undefined,
>(message: TMessage): v.RegexAction<TInput, TMessage>;

export function publisherUniqueSlugPk(
	message?: v.ErrorMessage<v.RegexIssue<string>>,
): v.RegexAction<string, v.ErrorMessage<v.RegexIssue<string>> | undefined> {
	return v.regex(
		PUBLISHER_UNIQUE_SLUG_PARTITION_KEY_REGEX,
		message ?? defaultMessage,
	);
}

export const publisherUniqueSlugPkComponentsSchema = v.strictObject({
	slug: v.pipe(v.string(), v.slug()),
});

export type PublisherUniqueSlugPkComponents = v.InferOutput<
	typeof publisherUniqueSlugPkComponentsSchema
>;

export function capturePublisherUniqueSlugPkComponents(
	message?: v.ErrorMessage<v.RawTransformIssue<string>> | undefined,
): v.RawTransformAction<string, PublisherUniqueSlugPkComponents> {
	return v.captureRegex(
		PUBLISHER_UNIQUE_SLUG_PARTITION_KEY_REGEX,
		message ?? defaultMessage,
	) as v.RawTransformAction<string, PublisherUniqueSlugPkComponents>;
}
