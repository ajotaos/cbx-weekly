import { PUBLISHER_SORT_KEY_REGEX } from '../regex';

import * as v from '../../core';

import type { EmptyObject } from 'type-fest';

const defaultMessage: v.ErrorMessage<v.GenericIssue<string>> = (issue) =>
	`Invalid publisher sk: Received "${issue.input}"`;

export function publisherSk<TInput extends string>(): v.RegexAction<
	TInput,
	undefined
>;

export function publisherSk<
	TInput extends string,
	const TMessage extends v.ErrorMessage<v.RegexIssue<TInput>> | undefined,
>(message: TMessage): v.RegexAction<TInput, TMessage>;

export function publisherSk(
	message?: v.ErrorMessage<v.RegexIssue<string>>,
): v.RegexAction<string, v.ErrorMessage<v.RegexIssue<string>> | undefined> {
	return v.regex(PUBLISHER_SORT_KEY_REGEX, message ?? defaultMessage);
}

export const publisherSkComponentsSchema = v.strictObject({});

export type PublisherSkComponents = EmptyObject;

export function capturePublisherSkComponents(
	message?: v.ErrorMessage<v.RawTransformIssue<string>> | undefined,
): v.RawTransformAction<string, PublisherSkComponents> {
	return v.captureRegex(
		PUBLISHER_SORT_KEY_REGEX,
		message ?? defaultMessage,
	) as v.RawTransformAction<string, PublisherSkComponents>;
}
