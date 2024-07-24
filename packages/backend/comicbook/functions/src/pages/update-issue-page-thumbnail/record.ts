import * as vx_s3 from '@cbx-weekly/backend-comicbook-s3/valibot';
import * as v from '@cbx-weekly/backend-core-valibot';

export const recordSchema = v.object({
	body: v.object({
		'detail-type': v.literal('Object Created'),
		detail: v.object({
			object: v.object({
				key: v.pipe(v.string(), vx_s3.captureIssuePageKey()),
			}),
		}),
	}),
});
