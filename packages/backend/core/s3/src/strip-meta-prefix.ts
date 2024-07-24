export type StripAmzMetaPrefixKeys<T> = {
	[K in keyof T & string as K extends `x-amz-meta-${infer U}` ? U : K]: T[K];
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function stripAmzMetaPrefix<T extends Record<string, any>>(
	inputObj: T,
): StripAmzMetaPrefixKeys<T> {
	const result: Record<string, string> = {};

	for (const key in inputObj) {
		if (key.startsWith('x-amz-meta-')) {
			const newKey = key.slice(11);
			result[newKey] = inputObj[key];
		} else {
			result[key] = inputObj[key];
		}
	}

	return result as StripAmzMetaPrefixKeys<T>;
}
