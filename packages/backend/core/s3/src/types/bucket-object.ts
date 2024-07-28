import * as v from 'valibot';

import { omit } from 'es-toolkit';
import { camelKeys } from 'string-ts';

export type RawBucketObject = {
	Key: string;
	Body: Uint8Array;
	Metadata: Record<string, string>;
};

export function bucketObject<
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	TSchema extends v.GenericSchema<RawBucketObject, any>,
>(schema: TSchema) {
	return v.pipe(
		schema,
		v.transform((value) => omit(value, Array.from(keysToOmit))),
		v.transform(camelKeys),
	);
}

const keysToOmit = ['Key'] as const;
