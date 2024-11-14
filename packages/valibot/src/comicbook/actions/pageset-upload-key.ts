import { PAGESET_UPLOAD_KEY_REGEX } from '../regex';

import * as v from '../../core';

const defaultMessage: v.ErrorMessage<v.GenericIssue<string>> = (issue) =>
	`Invalid pageset upload key: Received "${issue.input}"`;

export function pagesetUploadKey<TInput extends string>(): v.RegexAction<
	TInput,
	undefined
>;

export function pagesetUploadKey<
	TInput extends string,
	const TMessage extends v.ErrorMessage<v.RegexIssue<TInput>> | undefined,
>(message: TMessage): v.RegexAction<TInput, TMessage>;

export function pagesetUploadKey(
	message?: v.ErrorMessage<v.RegexIssue<string>>,
): v.RegexAction<string, v.ErrorMessage<v.RegexIssue<string>> | undefined> {
	return v.regex(PAGESET_UPLOAD_KEY_REGEX, message ?? defaultMessage);
}

export const pagesetUploadKeyComponentsSchema = v.strictObject({
	pagesetId: v.pipe(v.string(), v.id()),
});

export type PagesetUploadKeyComponents = v.InferOutput<
	typeof pagesetUploadKeyComponentsSchema
>;

export function capturePagesetUploadKeyComponents(
	message?: v.ErrorMessage<v.RawTransformIssue<string>> | undefined,
): v.RawTransformAction<string, PagesetUploadKeyComponents> {
	return v.captureRegex(
		PAGESET_UPLOAD_KEY_REGEX,
		message ?? defaultMessage,
	) as v.RawTransformAction<string, PagesetUploadKeyComponents>;
}
