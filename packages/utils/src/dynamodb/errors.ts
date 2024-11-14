import { Errors } from '../errors';

import { Logs } from '../logs';

class ItemAlreadyExistsError extends Error {
	constructor(
		readonly type: string,
		readonly criteria: Logs.Format.PrimitiveObject,
	) {
		super(
			`The "${type}" already exists with the provided criteria: ${Logs.Format.flatten(criteria)}. Ensure the provided values are unique.`,
		);
		this.name = 'ItemAlreadyExistsError';

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, ItemAlreadyExistsError);
		}
	}
}

class ItemNotFoundError extends Error {
	constructor(
		readonly type: string,
		readonly criteria: Logs.Format.PrimitiveObject,
	) {
		super(
			`The requested "${type}" could not be found using the provided criteria: ${Logs.Format.flatten(criteria)}. Please verify the correctness of the provided values.`,
		);
		this.name = 'ItemNotFoundError';

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, ItemNotFoundError);
		}
	}
}

export const itemAlreadyExistsError = Errors.makeUtils(ItemAlreadyExistsError);
export const itemNotFoundError = Errors.makeUtils(ItemNotFoundError);
