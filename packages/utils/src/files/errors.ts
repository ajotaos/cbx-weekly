import { Errors } from '../errors';

class UnsupportedFileTypeError extends Error {
	constructor(readonly fileType: string) {
		super(
			`The file type "${fileType}" is not supported. Please provide a file with a supported format.`,
		);

		this.name = 'UnsupportedFileTypeError';

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, UnsupportedFileTypeError);
		}
	}
}

export const unsupportedFileTypeError = Errors.makeUtils(
	UnsupportedFileTypeError,
);
