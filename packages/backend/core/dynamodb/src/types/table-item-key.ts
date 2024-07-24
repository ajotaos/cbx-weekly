import * as v from 'valibot';

export type RawTableItemKey = Array<string>;

export function tableItemKey<
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	TSchema extends v.GenericSchema<RawTableItemKey, any>,
>(schema: TSchema) {
	return v.pipe(
		v.string(),
		v.transform((value) => value.split(':')),
		v.check((value) => value.at(-1) === '#'),
		v.transform((value) => value.slice(0, -1)),
		schema,
	);
}
