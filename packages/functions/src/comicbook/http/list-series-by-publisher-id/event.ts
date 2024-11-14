import * as v from '@cbx-weekly/valibot/core';

import { camelKeys } from 'string-ts';

export const eventSchema = v.object({
	pathParameters: v.pipe(
		v.object({
			publisher_id: v.pipe(v.string(), v.id()),
		}),
		v.transform(camelKeys),
	),
	queryStringParameters: v.pipe(
		v.strictObject({
			cursor: v.optional(v.pipe(v.string(), v.nonEmpty())),
			order: v.optional(v.picklist(['asc', 'desc'])),
			limit: v.optional(
				v.pipe(
					v.string(),
					v.digits(),
					v.transform((value) => Number(value)),
					v.integer(),
					v.minValue(1),
				),
			),
		}),
		v.transform(camelKeys),
	),
});
