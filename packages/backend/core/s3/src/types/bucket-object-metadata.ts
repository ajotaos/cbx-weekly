import * as v from 'valibot';

import { deepCamelKeys } from 'string-ts';

export type RawBucketObjectMetadata = Record<string, string>;

export function bucketObjectMetadata<
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	TMetadataSchema extends v.GenericSchema<RawBucketObjectMetadata, any>,
>(schema: TMetadataSchema) {
	return v.pipe(schema, v.transform(deepCamelKeys));
}
