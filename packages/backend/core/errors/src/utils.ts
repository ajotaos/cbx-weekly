import type { Constructor } from 'type-fest';

export type ErrorHandler<TError extends Error> = {
	<TResult>(error: unknown, handler: (error: TError) => TResult): TResult;
	<TResult>(handler: (error: TError) => TResult): (error: unknown) => TResult;
};

export function createErrorHandler<TError extends Error>(
	errorClass: Constructor<TError>,
) {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	return (<TResult>(...args: Array<any>) => {
		let handler: (error: TError) => TResult;

		const fn = (error: unknown) => {
			if (error instanceof errorClass) {
				return handler(error);
			}

			throw error;
		};

		if (args.length === 1) {
			[handler] = args;

			return fn;
		}

		[, handler] = args;

		return fn(args[0]);
	}) as ErrorHandler<TError>;
}

export function isError<TError extends Error>(errorClass: Constructor<TError>) {
	return (error: unknown): error is TError => error instanceof errorClass;
}
