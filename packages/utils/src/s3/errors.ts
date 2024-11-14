import { Errors } from '../errors';

import { Logs } from '../logs';

class ObjectNotFoundError extends Error {
	constructor(
		readonly type: string,
		readonly criteria: Logs.Format.PrimitiveObject,
	) {
		super(
			`The requested "${type}" could not be found using the provided criteria: ${Logs.Format.flatten(criteria)}. Please verify the correctness of the provided values.`,
		);
		this.name = 'ObjectNotFoundError';

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, ObjectNotFoundError);
		}
	}
}

export const objectNotFoundError = Errors.makeUtils(ObjectNotFoundError);
