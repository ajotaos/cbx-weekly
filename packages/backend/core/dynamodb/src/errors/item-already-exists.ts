import { createErrorHandler, isError } from '@cbx-weekly/backend-core-errors';

import { snakeCase } from 'string-ts';

import type { Primitive } from 'type-fest';

class ItemAlreadyExistsError extends Error {
	constructor(
		readonly type: string,
		readonly criteria: Record<string, Primitive>,
	) {
		const formattedCriteria = Object.entries(criteria)
			.map(([key, value]) => `${snakeCase(key)}: "${String(value)}"`)
			.join(', ');

		super(
			`The "${snakeCase(type)}" already exists with the provided criteria: ${formattedCriteria}. Ensure the provided values are unique.`,
		);
		this.name = 'ItemAlreadyExistsError';

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, ItemAlreadyExistsError);
		}
	}
}

export function throwItemAlreadyExistsError(
	type: string,
	criteria: Record<string, Primitive>,
): never {
	throw new ItemAlreadyExistsError(type, criteria);
}

export const handleItemAlreadyExistsError = createErrorHandler(
	ItemAlreadyExistsError,
);

export const isItemAlreadyExistsError = isError(ItemAlreadyExistsError);
