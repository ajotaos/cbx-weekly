import * as v from '@cbx-weekly/valibot/core';

export const recordSchema = v.object({
	body: v.object({
		detail: v.object({
			object: v.object({
				key: v.strictObject({
					pagesetId: v.pipe(v.string(), v.id()),
				}),
			}),
		}),
	}),
});
