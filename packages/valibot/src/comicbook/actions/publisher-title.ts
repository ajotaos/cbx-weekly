import { PUBLISHER_TITLE_REGEX } from '../regex';

import { publisherName } from './publisher-name';

import * as v from '../../core';

const defaultMessage: v.ErrorMessage<v.GenericIssue<string>> = (issue) =>
	`Invalid publisher title: Received "${issue.input}"`;

export function publisherTitle<TInput extends string>(): v.RegexAction<
	TInput,
	undefined
>;

export function publisherTitle<
	TInput extends string,
	const TMessage extends v.ErrorMessage<v.RegexIssue<TInput>> | undefined,
>(message: TMessage): v.RegexAction<TInput, TMessage>;

export function publisherTitle(
	message?: v.ErrorMessage<v.RegexIssue<string>>,
): v.RegexAction<string, v.ErrorMessage<v.RegexIssue<string>> | undefined> {
	return v.regex(PUBLISHER_TITLE_REGEX, message ?? defaultMessage);
}

export const publisherTitleComponentsSchema = v.strictObject({
	name: v.pipe(v.string(), publisherName()),
});

export type PublisherTitleComponents = v.InferOutput<
	typeof publisherTitleComponentsSchema
>;

export function capturePublisherTitleComponents(
	message?: v.ErrorMessage<v.RawTransformIssue<string>> | undefined,
): v.RawTransformAction<string, PublisherTitleComponents> {
	return v.captureRegex(
		PUBLISHER_TITLE_REGEX,
		message ?? defaultMessage,
	) as v.RawTransformAction<string, PublisherTitleComponents>;
}
