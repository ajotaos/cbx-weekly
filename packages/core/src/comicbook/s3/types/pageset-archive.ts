import * as v from '@cbx-weekly/valibot/core';

import { deepCamelKeys } from 'string-ts';

export const rawPagesetArchiveMetadataSchema = v.object({
	'pageset-id': v.pipe(v.string(), v.id()),
});

export type RawPagesetArchiveMetadata = v.InferInput<
	typeof rawPagesetArchiveMetadataSchema
>;

export const pagesetArchiveMetadataSchema = v.pipe(
	rawPagesetArchiveMetadataSchema,
	v.transform(deepCamelKeys),
);

export type PagesetArchiveMetadata = v.InferInput<
	typeof pagesetArchiveMetadataSchema
>;
