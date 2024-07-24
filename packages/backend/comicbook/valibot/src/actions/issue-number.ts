import * as v from 'valibot';

const ISSUE_NUMBER_REGEX = /^\d+(?:\.[A-Z0-9]+)?$/u;

export function issueNumber<TInput extends string>(): v.RegexAction<
	TInput,
	undefined
>;

export function issueNumber<
	TInput extends string,
	const TMessage extends v.ErrorMessage<v.RegexIssue<TInput>> | undefined,
>(message: TMessage): v.RegexAction<TInput, TMessage>;

export function issueNumber(
	message?: v.ErrorMessage<v.RegexIssue<string>>,
): v.RegexAction<string, v.ErrorMessage<v.RegexIssue<string>> | undefined> {
	return v.regex(
		ISSUE_NUMBER_REGEX,
		message ?? ((issue) => `Invalid issue number: Received ${issue.input}`),
	);
}
