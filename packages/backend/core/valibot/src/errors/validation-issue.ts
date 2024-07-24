import { createErrorHandler, isError } from '@cbx-weekly/backend-core-errors';

import type { BaseIssue } from 'valibot';

class ValidationIssueError<TInput> extends Error {
	constructor(readonly issues: Array<BaseIssue<TInput>>) {
		super(
			'The input provided has validation issues. Please resolve the schema violations and try again.',
		);

		this.name = 'ValidationIssueError';

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, ValidationIssueError);
		}
	}
}

export function throwValidationIssueError<TInput>(
	issues: Array<BaseIssue<TInput>>,
): never {
	throw new ValidationIssueError(issues);
}

export const handleValidationIssueError =
	createErrorHandler(ValidationIssueError);

export const isValidationIssueError = isError(ValidationIssueError);
