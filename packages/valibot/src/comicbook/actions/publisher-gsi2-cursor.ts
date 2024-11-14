import { PUBLISHER_GSI2_CURSOR_REGEX } from '../regex';

import * as v from '../../core';

const defaultMessage: v.ErrorMessage<v.GenericIssue<string>> = (issue) =>
	`Invalid publisher gsi2 cursor: Received "${issue.input}"`;

export function publisherGsi2Cursor<TInput extends string>(): v.RegexAction<
	TInput,
	undefined
>;

export function publisherGsi2Cursor<
	TInput extends string,
	const TMessage extends v.ErrorMessage<v.RegexIssue<TInput>> | undefined,
>(message: TMessage): v.RegexAction<TInput, TMessage>;

export function publisherGsi2Cursor(
	message?: v.ErrorMessage<v.RegexIssue<string>>,
): v.RegexAction<string, v.ErrorMessage<v.RegexIssue<string>> | undefined> {
	return v.regex(PUBLISHER_GSI2_CURSOR_REGEX, message ?? defaultMessage);
}

export const publisherGsi2CursorComponentsSchema = v.strictObject({
	id: v.pipe(v.string(), v.id()),
	slug: v.pipe(v.string(), v.slug()),
});

export type PublisherGsi2CursorComponents = v.InferOutput<
	typeof publisherGsi2CursorComponentsSchema
>;

export function capturePublisherGsi2CursorComponents(
	message?: v.ErrorMessage<v.RawTransformIssue<string>> | undefined,
): v.RawTransformAction<string, PublisherGsi2CursorComponents> {
	return v.captureRegex(
		PUBLISHER_GSI2_CURSOR_REGEX,
		message ?? defaultMessage,
	) as v.RawTransformAction<string, PublisherGsi2CursorComponents>;
}
