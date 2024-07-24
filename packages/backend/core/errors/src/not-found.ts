class NotFoundError extends Error {
	constructor() {
		super('The requested resource was not found.');

		this.name = 'NotFoundError';

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, NotFoundError);
		}
	}
}

export function throwNotFoundError(): never {
	throw new NotFoundError();
}

export function handleNotFoundError<TResult>(
	handler: (error: NotFoundError) => TResult,
) {
	return (error: unknown) => {
		if (error instanceof NotFoundError) {
			return handler(error);
		}

		throw error;
	};
}
