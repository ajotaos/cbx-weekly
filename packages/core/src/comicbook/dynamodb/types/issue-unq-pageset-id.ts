import * as v_comicbook from '@cbx-weekly/valibot/comicbook';
import * as v from '@cbx-weekly/valibot/core';

import { deepCamelKeys } from 'string-ts';

export const rawIssueUniquePagesetIdSchema = v.strictObject({
	Pk: v.pipe(v.string(), v_comicbook.captureIssueUniquePagesetIdPkComponents()),
	Sk: v.pipe(v.string(), v_comicbook.captureIssueUniquePagesetIdSkComponents()),
	PagesetId: v.pipe(v.string(), v.id()),
	IssueId: v.pipe(v.string(), v.id()),
});

export type RawIssueUniquePagesetId = v.InferInput<
	typeof rawIssueUniquePagesetIdSchema
>;

export const issueUniquePagesetIdSchema = v.pipe(
	v.omit(v.object(rawIssueUniquePagesetIdSchema.entries), ['Pk', 'Sk']),
	v.transform(deepCamelKeys),
);

export type IssueUniquePagesetId = v.InferOutput<
	typeof issueUniquePagesetIdSchema
>;
