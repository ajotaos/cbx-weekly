import { ISSUE_TITLE_REGEX } from '../regex';

import { issueNumber } from './issue-number';
import { publisherName } from './publisher-name';
import { seriesName } from './series-name';

import * as v from '../../core';

const defaultMessage: v.ErrorMessage<v.GenericIssue<string>> = (issue) =>
	`Invalid issue title: Received "${issue.input}"`;

export function issueTitle<TInput extends string>(): v.RegexAction<
	TInput,
	undefined
>;

export function issueTitle<
	TInput extends string,
	const TMessage extends v.ErrorMessage<v.RegexIssue<TInput>> | undefined,
>(message: TMessage): v.RegexAction<TInput, TMessage>;

export function issueTitle(
	message?: v.ErrorMessage<v.RegexIssue<string>>,
): v.RegexAction<string, v.ErrorMessage<v.RegexIssue<string>> | undefined> {
	return v.regex(ISSUE_TITLE_REGEX, message ?? defaultMessage);
}

export const issueTitleComponentsSchema = v.strictObject({
	publisher: v.pipe(v.string(), publisherName()),
	series: v.pipe(v.string(), seriesName()),
	number: v.pipe(v.string(), issueNumber()),
});

export type IssueTitleComponents = v.InferOutput<
	typeof issueTitleComponentsSchema
>;

export function captureIssueTitleComponents(
	message?: v.ErrorMessage<v.RawTransformIssue<string>> | undefined,
): v.RawTransformAction<string, IssueTitleComponents> {
	return v.captureRegex(
		ISSUE_TITLE_REGEX,
		message ?? defaultMessage,
	) as v.RawTransformAction<string, IssueTitleComponents>;
}
