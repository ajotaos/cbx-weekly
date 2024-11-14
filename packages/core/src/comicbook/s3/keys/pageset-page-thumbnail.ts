import { S3 } from '@cbx-weekly/utils/s3';

import type * as v_comicbook from '@cbx-weekly/valibot/comicbook';

export function makePagesetPageThumbnailKey(
	props: v_comicbook.PagesetPageThumbnailKeyComponents,
) {
	return S3.Keys.makeKey(
		'pagesets',
		props.pagesetId,
		'pages',
		`${props.number}.thumbnail.jpg`,
	);
}
