export function mapIfDefined<T, U>(
	value: T | undefined,
	fn: (value: T) => U,
): U | undefined {
	return value !== undefined ? fn(value) : undefined;
}
