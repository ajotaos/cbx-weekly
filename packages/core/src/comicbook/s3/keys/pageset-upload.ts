import { S3 } from '@cbx-weekly/utils/s3';

import type * as v_comicbook from '@cbx-weekly/valibot/comicbook';

export function makePagesetUploadKey(
	props: v_comicbook.PagesetUploadKeyComponents,
) {
	return S3.Keys.makeKey('pagesets', props.pagesetId, 'upload.zip');
}
