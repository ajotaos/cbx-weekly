import { PUBLISHER_UNIQUE_SLUG_SORT_KEY_REGEX } from '../regex';

import * as v from '../../core';

import type { EmptyObject } from 'type-fest';

const defaultMessage: v.ErrorMessage<v.GenericIssue<string>> = (issue) =>
	`Invalid publisher unique slug sk: Received "${issue.input}"`;

export function publisherUniqueSlugSk<TInput extends string>(): v.RegexAction<
	TInput,
	undefined
>;

export function publisherUniqueSlugSk<
	TInput extends string,
	const TMessage extends v.ErrorMessage<v.RegexIssue<TInput>> | undefined,
>(message: TMessage): v.RegexAction<TInput, TMessage>;

export function publisherUniqueSlugSk(
	message?: v.ErrorMessage<v.RegexIssue<string>>,
): v.RegexAction<string, v.ErrorMessage<v.RegexIssue<string>> | undefined> {
	return v.regex(
		PUBLISHER_UNIQUE_SLUG_SORT_KEY_REGEX,
		message ?? defaultMessage,
	);
}

export const publisherUniqueSlugSkComponentsSchema = v.strictObject({});

export type PublisherUniqueSlugSkComponents = EmptyObject;

export function capturePublisherUniqueSlugSkComponents(
	message?: v.ErrorMessage<v.RawTransformIssue<string>> | undefined,
): v.RawTransformAction<string, PublisherUniqueSlugSkComponents> {
	return v.captureRegex(
		PUBLISHER_UNIQUE_SLUG_SORT_KEY_REGEX,
		message ?? defaultMessage,
	) as v.RawTransformAction<string, PublisherUniqueSlugSkComponents>;
}
