import * as v_comicbook from '@cbx-weekly/valibot/comicbook';
import * as v from '@cbx-weekly/valibot/core';

import { deepCamelKeys } from 'string-ts';

export const rawIssueUniqueSlugSchema = v.strictObject({
	Pk: v.pipe(v.string(), v_comicbook.captureIssueUniqueSlugPkComponents()),
	Sk: v.pipe(v.string(), v_comicbook.captureIssueUniqueSlugSkComponents()),
	Slug: v.pipe(v.string(), v.slug()),
	IssueId: v.pipe(v.string(), v.id()),
});

export type RawIssueUniqueSlug = v.InferInput<typeof rawIssueUniqueSlugSchema>;

export const issueUniqueSlugSchema = v.pipe(
	v.omit(v.object(rawIssueUniqueSlugSchema.entries), ['Pk', 'Sk']),
	v.transform(deepCamelKeys),
);

export type IssueUniqueSlug = v.InferOutput<typeof issueUniqueSlugSchema>;
