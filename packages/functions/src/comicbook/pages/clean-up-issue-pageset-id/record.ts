import * as v from '@cbx-weekly/valibot/core';

import { deepCamelKeys } from 'string-ts';

export const recordSchema = v.object({
	body: v.object({
		dynamodb: v.pipe(
			v.object({
				NewImage: v.object({
					PagesetId: v.optional(v.string()),
				}),
				OldImage: v.object({
					Id: v.string(),
					PagesetId: v.string(),
				}),
			}),
			v.transform(deepCamelKeys),
		),
	}),
});
