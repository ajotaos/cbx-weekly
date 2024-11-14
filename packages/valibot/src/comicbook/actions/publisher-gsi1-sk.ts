import { PUBLISHER_GSI1_SORT_KEY_REGEX } from '../regex';

import * as v from '../../core';

import type { EmptyObject } from 'type-fest';

const defaultMessage: v.ErrorMessage<v.GenericIssue<string>> = (issue) =>
	`Invalid publisher gsi1 sk: Received "${issue.input}"`;

export function publisherGsi1Sk<TInput extends string>(): v.RegexAction<
	TInput,
	undefined
>;

export function publisherGsi1Sk<
	TInput extends string,
	const TMessage extends v.ErrorMessage<v.RegexIssue<TInput>> | undefined,
>(message: TMessage): v.RegexAction<TInput, TMessage>;

export function publisherGsi1Sk(
	message?: v.ErrorMessage<v.RegexIssue<string>>,
): v.RegexAction<string, v.ErrorMessage<v.RegexIssue<string>> | undefined> {
	return v.regex(PUBLISHER_GSI1_SORT_KEY_REGEX, message ?? defaultMessage);
}

export const publisherGsi1SkComponentsSchema = v.strictObject({});

export type PublisherGsi1SkComponents = EmptyObject;

export function capturePublisherGsi1SkComponents(
	message?: v.ErrorMessage<v.RawTransformIssue<string>> | undefined,
): v.RawTransformAction<string, PublisherGsi1SkComponents> {
	return v.captureRegex(
		PUBLISHER_GSI1_SORT_KEY_REGEX,
		message ?? defaultMessage,
	) as v.RawTransformAction<string, PublisherGsi1SkComponents>;
}
