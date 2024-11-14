import { S3 } from '@cbx-weekly/utils/s3';

import type * as v_comicbook from '@cbx-weekly/valibot/comicbook';

export function makePagesetPageKey(
	props: v_comicbook.PagesetPageKeyComponents,
) {
	return S3.Keys.makeKey(
		'pagesets',
		props.pagesetId,
		'pages',
		`${props.number}.raw.jpg`,
	);
}
