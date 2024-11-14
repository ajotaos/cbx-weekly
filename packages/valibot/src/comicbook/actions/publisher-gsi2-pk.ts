import { PUBLISHER_GSI2_PARTITION_KEY_REGEX } from '../regex';

import * as v from '../../core';

import type { EmptyObject } from 'type-fest';

const defaultMessage: v.ErrorMessage<v.GenericIssue<string>> = (issue) =>
	`Invalid publisher gsi2 pk: Received "${issue.input}"`;

export function publisherGsi2Pk<TInput extends string>(): v.RegexAction<
	TInput,
	undefined
>;

export function publisherGsi2Pk<
	TInput extends string,
	const TMessage extends v.ErrorMessage<v.RegexIssue<TInput>> | undefined,
>(message: TMessage): v.RegexAction<TInput, TMessage>;

export function publisherGsi2Pk(
	message?: v.ErrorMessage<v.RegexIssue<string>>,
): v.RegexAction<string, v.ErrorMessage<v.RegexIssue<string>> | undefined> {
	return v.regex(PUBLISHER_GSI2_PARTITION_KEY_REGEX, message ?? defaultMessage);
}

export const publisherGsi2PkComponentsSchema = v.strictObject({});

export type PublisherGsi2PkComponents = EmptyObject;

export function capturePublisherGsi2PkComponents(
	message?: v.ErrorMessage<v.RawTransformIssue<string>> | undefined,
): v.RawTransformAction<string, PublisherGsi2PkComponents> {
	return v.captureRegex(
		PUBLISHER_GSI2_PARTITION_KEY_REGEX,
		message ?? defaultMessage,
	) as v.RawTransformAction<string, PublisherGsi2PkComponents>;
}
