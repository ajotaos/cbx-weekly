import * as v from '@cbx-weekly/valibot/core';

import { deepCamelKeys } from 'string-ts';

export const recordSchema = v.object({
	body: v.object({
		dynamodb: v.pipe(
			v.object({
				OldImage: v.object({
					Id: v.string(),
				}),
			}),
			v.transform(deepCamelKeys),
		),
	}),
});
