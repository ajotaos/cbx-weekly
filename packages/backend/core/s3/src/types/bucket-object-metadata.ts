import * as v from 'valibot';

import { camelKeys } from 'string-ts';

export type RawBucketObjectMetadata = Record<string, string>;

export function bucketObjectMetadata<
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	TSchema extends v.GenericSchema<RawBucketObjectMetadata, any>,
>(schema: TSchema) {
	return v.pipe(
		schema,
		// v.transform(stripAmzMetaPrefix),
		v.transform(camelKeys),
	);
}
