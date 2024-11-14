import { PAGESET_ARCHIVE_KEY_REGEX } from '../regex';

import * as v from '../../core';

const defaultMessage: v.ErrorMessage<v.GenericIssue<string>> = (issue) =>
	`Invalid pageset archive key: Received "${issue.input}"`;

export function pagesetArchiveKey<TInput extends string>(): v.RegexAction<
	TInput,
	undefined
>;

export function pagesetArchiveKey<
	TInput extends string,
	const TMessage extends v.ErrorMessage<v.RegexIssue<TInput>> | undefined,
>(message: TMessage): v.RegexAction<TInput, TMessage>;

export function pagesetArchiveKey(
	message?: v.ErrorMessage<v.RegexIssue<string>>,
): v.RegexAction<string, v.ErrorMessage<v.RegexIssue<string>> | undefined> {
	return v.regex(PAGESET_ARCHIVE_KEY_REGEX, message ?? defaultMessage);
}

export const pagesetArchiveKeyComponentsSchema = v.strictObject({
	pagesetId: v.pipe(v.string(), v.id()),
});

export type PagesetArchiveKeyComponents = v.InferOutput<
	typeof pagesetArchiveKeyComponentsSchema
>;

export function capturePagesetArchiveKeyComponents(
	message?: v.ErrorMessage<v.RawTransformIssue<string>> | undefined,
): v.RawTransformAction<string, PagesetArchiveKeyComponents> {
	return v.captureRegex(
		PAGESET_ARCHIVE_KEY_REGEX,
		message ?? defaultMessage,
	) as v.RawTransformAction<string, PagesetArchiveKeyComponents>;
}
