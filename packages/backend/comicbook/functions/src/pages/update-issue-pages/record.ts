import { ISSUE_PAGES_UPLOAD_BUCKET_OBJECT_KEY_REGEX } from '@cbx-weekly/backend-comicbook-s3';

import * as vx from '@cbx-weekly/shared-valibot';
import * as v from 'valibot';

export const recordSchema = v.object({
	body: v.object({
		'detail-type': v.literal('Object Created'),
		detail: v.object({
			object: v.object({
				key: v.pipe(
					v.string(),
					vx.captureNamedGroups(
						ISSUE_PAGES_UPLOAD_BUCKET_OBJECT_KEY_REGEX,
						(issue) =>
							`Invalid issue pages upload bucket object key: Received "${issue.input}"`,
					),
					v.strictObject({
						id: v.pipe(v.string(), vx.ulid()),
						issueId: v.pipe(v.string(), vx.ulid()),
					}),
				),
			}),
		}),
	}),
});
