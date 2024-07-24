class UnsupportedFileTypeError extends Error {
	constructor(fileType: string) {
		super(`The file type '${fileType}' is not supported.`);

		this.name = 'UnsupportedFileTypeError';

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, UnsupportedFileTypeError);
		}
	}
}

export function throwUnsupportedFileTypeError(fileType: string): never {
	throw new UnsupportedFileTypeError(fileType);
}

export function handleUnsupportedFileTypeError<TResult>(
	handler: (error: UnsupportedFileTypeError) => TResult,
) {
	return (error: unknown) => {
		if (error instanceof UnsupportedFileTypeError) {
			return handler(error);
		}

		throw error;
	};
}
