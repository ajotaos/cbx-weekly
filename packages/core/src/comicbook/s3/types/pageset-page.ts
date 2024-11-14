import * as v_comicbook from '@cbx-weekly/valibot/comicbook';
import * as v from '@cbx-weekly/valibot/core';

import { deepCamelKeys } from 'string-ts';

export const rawPagesetPageMetadataSchema = v.object({
	number: v.pipe(v.string(), v_comicbook.pagesetPageNumber()),
	'pageset-id': v.pipe(v.string(), v.id()),
});

export type RawPagesetPageMetadata = v.InferInput<
	typeof rawPagesetPageMetadataSchema
>;

export const pagesetPageMetadataSchema = v.pipe(
	rawPagesetPageMetadataSchema,
	v.transform(deepCamelKeys),
);

export type PagesetPageMetadata = v.InferInput<
	typeof pagesetPageMetadataSchema
>;
