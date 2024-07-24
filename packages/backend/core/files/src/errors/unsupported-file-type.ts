import { createErrorHandler, isError } from '@cbx-weekly/backend-core-errors';

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

// Function to throw the error
export function throwUnsupportedFileTypeError(fileType: string): never {
	throw new UnsupportedFileTypeError(fileType);
}

// Error handler for the UnsupportedFileTypeError
export const handleUnsupportedFileTypeError = createErrorHandler(
	UnsupportedFileTypeError,
);

// Type guard to identify the error
export const isUnsupportedFileTypeError = isError(UnsupportedFileTypeError);
