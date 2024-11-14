import pino from 'pino';

import type { ScreamingSnakeCase } from 'type-fest';

export namespace Logs {
	export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

	export type CreateLoggerProps = {
		name: string;
		level: LogLevel;
	};

	export function createLogger(props: CreateLoggerProps) {
		// // Create the logger instance
		// @ts-expect-error
		const pinoLogger = pino({
			name: props.name,
			level: props.level,
			timestamp: pino.stdTimeFunctions.isoTime,
			customLevels: {
				debug: 10,
				info: 20,
				warn: 30,
				error: 40,
			} satisfies Record<LogLevel, number>,
			useOnlyCustomLevels: true,
			formatters: {
				level: (label: LogLevel) => ({ level: label }),
				bindings: () => ({}),
				log: (object: {
					level: ScreamingSnakeCase<LogLevel>;
					time: number;
					message: string;
				}) => object,
			},
			messageKey: 'message',
		});

		return {
			debug: (message: string, meta?: Record<string, unknown>) =>
				pinoLogger.debug({ ...meta }, message),
			info: (message: string, meta?: Record<string, unknown>) =>
				pinoLogger.info({ ...meta }, message),
			warn: (message: string, meta?: Record<string, unknown>) =>
				pinoLogger.warn({ ...meta }, message),
			error: (message: string, meta?: Record<string, unknown>) =>
				pinoLogger.error({ ...meta }, message),
		} as const;
	}

	export namespace Format {
		export type Primitive = import('type-fest').Primitive;

		export type PrimitiveObject = {
			[key: string]: Primitive | PrimitiveObject;
		};

		export function flatten(input: PrimitiveObject, separator = ', ') {
			const _flatten = (obj: PrimitiveObject, prefix = ''): string[] => {
				return Object.entries(obj).flatMap(([key, value]) => {
					const fullKey = prefix ? `${prefix}.${key}` : key;
					if (typeof value === 'object' && value !== null) {
						return _flatten(value as PrimitiveObject, fullKey);
					}

					if (
						typeof value === 'string' ||
						typeof value === 'number' ||
						typeof value === 'boolean' ||
						typeof value === 'symbol'
					) {
						return `${fullKey}: ${String(value)}`;
					}

					return [];
				});
			};

			return _flatten(input).join(separator);
		}
	}
}
