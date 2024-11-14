import * as v from '@cbx-weekly/valibot/core';

export const eventSchema = v.object({
	body: v.strictObject({
		issueId: v.pipe(v.string(), v.id()),
	}),
});
