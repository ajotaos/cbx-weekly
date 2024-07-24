import { createErrorHandler, isError } from '@cbx-weekly/backend-core-errors';

import { snakeCase } from 'string-ts';

import type { Primitive } from 'type-fest';

class ObjectNotFoundError extends Error {
	constructor(
		readonly type: string,
		readonly criteria: Record<string, Primitive>,
	) {
		const formattedCriteria = Object.entries(criteria)
			.map(([key, value]) => `${snakeCase(key)}: "${String(value)}"`)
			.join(', ');

		super(
			`The requested "${snakeCase(type)}" could not be found using the provided criteria: ${formattedCriteria}. Please verify the correctness of the provided values.`,
		);
		this.name = 'ObjectNotFoundError';

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, ObjectNotFoundError);
		}
	}
}

export function throwObjectNotFoundError(
	type: string,
	criteria: Record<string, Primitive>,
): never {
	throw new ObjectNotFoundError(type, criteria);
}

export const handleObjectNotFoundError =
	createErrorHandler(ObjectNotFoundError);

export const isObjectNotFoundError = isError(ObjectNotFoundError);
