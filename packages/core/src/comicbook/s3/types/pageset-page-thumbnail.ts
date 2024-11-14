import * as v_comicbook from '@cbx-weekly/valibot/comicbook';
import * as v from '@cbx-weekly/valibot/core';

import { deepCamelKeys } from 'string-ts';

export const rawPagesetPageThumbnailMetadataSchema = v.object({
	number: v.pipe(v.string(), v_comicbook.pagesetPageNumber()),
	'pageset-id': v.pipe(v.string(), v.id()),
});

export type RawPagesetPageThumbnailMetadata = v.InferInput<
	typeof rawPagesetPageThumbnailMetadataSchema
>;

export const pagesetPageThumbnailMetadataSchema = v.pipe(
	rawPagesetPageThumbnailMetadataSchema,
	v.transform(deepCamelKeys),
);

export type PagesetPageThumbnailMetadata = v.InferInput<
	typeof pagesetPageThumbnailMetadataSchema
>;
