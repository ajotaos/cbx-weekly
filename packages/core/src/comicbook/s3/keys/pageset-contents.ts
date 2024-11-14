import { S3 } from '@cbx-weekly/utils/s3';

import type * as v_comicbook from '@cbx-weekly/valibot/comicbook';

export function makePagesetContentsPrefix(
	props: v_comicbook.PagesetContentsPrefixComponents,
) {
	return S3.Keys.makeKey('pagesets', props.pagesetId, '/');
}
