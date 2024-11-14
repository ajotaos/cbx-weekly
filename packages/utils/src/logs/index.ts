export namespace Logs {
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
