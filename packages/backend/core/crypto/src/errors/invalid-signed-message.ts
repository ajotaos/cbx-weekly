import { createErrorHandler, isError } from '@cbx-weekly/backend-core-errors';

class InvalidSignedMessageError extends Error {
	constructor() {
		super(
			'The signed message is invalid or has been tampered with. Ensure the message is correctly signed.',
		);
		this.name = 'InvalidSignedMessageError';

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, InvalidSignedMessageError);
		}
	}
}

export function throwInvalidSignedMessageError(): never {
	throw new InvalidSignedMessageError();
}

export const handleInvalidSignedMessageError = createErrorHandler(
	InvalidSignedMessageError,
);

export const isInvalidSignedMessageError = isError(InvalidSignedMessageError);
