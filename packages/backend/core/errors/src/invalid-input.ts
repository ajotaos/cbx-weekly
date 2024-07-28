import { createErrorHandler, isError } from './utils';

import type { BaseIssue } from 'valibot';

class InvalidInputError<TInput> extends Error {
	constructor(readonly issues: Array<BaseIssue<TInput>>) {
		super(
			'The provided input does not meet the required criteria. Please review and correct them.',
		);

		this.name = 'InvalidInputError';

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, InvalidInputError);
		}
	}
}

export function throwInvalidInputError<TInput>(
	issues: Array<BaseIssue<TInput>>,
): never {
	throw new InvalidInputError(issues);
}

export const handleInvalidInputError = createErrorHandler(InvalidInputError);

export const isInvalidInputError = isError(InvalidInputError);
