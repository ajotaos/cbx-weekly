import { tableItem, tableItemKey } from '@cbx-weekly/backend-core-dynamodb';

import * as vx from '@cbx-weekly/backend-comicbook-valibot';
import * as v from 'valibot';

export function parseIssueUniqueSlugTableItem(input: unknown) {
	return v.parse(issueUniqueSlugTableItemSchema, input, {
		abortEarly: true,
		abortPipeEarly: true,
	});
}

const issueUniqueSlugTableItemSchema = tableItem(
	v.strictObject({
		Pk: tableItemKey(
			v.strictTuple([
				v.literal('issues'),
				v.literal('unq'),
				v.literal('slug'),
				v.pipe(v.string(), vx.slug()),
			]),
		),
		Sk: tableItemKey(v.strictTuple([])),
		Id: v.pipe(v.string(), vx.ulid()),
		Slug: v.pipe(v.string(), vx.slug()),
	}),
);

export type RawIssueUniqueSlugTableItem = v.InferInput<
	typeof issueUniqueSlugTableItemSchema
>;
export type IssueUniqueSlugTableItem = v.InferOutput<
	typeof issueUniqueSlugTableItemSchema
>;
