import * as v from 'valibot';

export type RawBucketObjectKey = Array<string>;

export function bucketObjectKey<
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	TSchema extends v.GenericSchema<RawBucketObjectKey, any>,
>(schema: TSchema) {
	return v.pipe(
		v.string(),
		v.transform((value) => value.split('/')),
		schema,
	);
}
