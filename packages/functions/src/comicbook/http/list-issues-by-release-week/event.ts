import * as v from '@cbx-weekly/valibot/core';

import { camelKeys } from 'string-ts';

export const eventSchema = v.object({
	queryStringParameters: v.pipe(
		v.strictObject({
			'release-week': v.pipe(v.string(), v.isoWeek()),
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
