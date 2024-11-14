import * as v from '@cbx-weekly/valibot/core';

import { deepCamelKeys } from 'string-ts';

export const rawPagesetUploadMetadataSchema = v.object({
	'pageset-id': v.pipe(v.string(), v.id()),
});

export type RawPagesetUploadMetadata = v.InferInput<
	typeof rawPagesetUploadMetadataSchema
>;

export const pagesetUploadMetadataSchema = v.pipe(
	rawPagesetUploadMetadataSchema,
	v.transform(deepCamelKeys),
);

export type PagesetUploadMetadata = v.InferInput<
	typeof pagesetUploadMetadataSchema
>;
