import type { Constructor } from 'type-fest';

export namespace Errors {
	export function makeUtils<TErrorConstructor extends Constructor<Error>>(
		errorClass: TErrorConstructor,
	) {
		type TError = InstanceType<TErrorConstructor>;

		type ErrorHandlingFunction = {
			<TResult>(error: unknown, handler: (error: TError) => TResult): TResult;
			<TResult>(
				handler: (error: TError) => TResult,
			): (error: unknown) => TResult;
		};

		const errorHandler: ErrorHandlingFunction = <TResult>(
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			...args: Array<any>
		) => {
			let handler: (error: TError) => TResult;

			const fn = (error: unknown) => {
				if (error instanceof errorClass) {
					// @ts-expect-error
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
		};

		const errorGuard = (error: unknown): error is TError =>
			error instanceof errorClass;

		const errorMaker = (...args: ConstructorParameters<typeof errorClass>) => {
			return new errorClass(...args);
		};

		return {
			handle: errorHandler,
			guard: errorGuard,
			make: errorMaker,
		};
	}
}
